import React, { useState, useEffect, useRef } from 'react';
import { ChatList } from './components/ChatList';
import { ChatRoom } from './components/ChatRoom';
import { Connect } from './components/Connect';
import { WebRTCService } from './services/webrtc';
import { LocalStorageService } from './services/db';
import { SignalingClient, SignalMessage } from './services/signaling';
import { 
  deriveIdentityKey, 
  generateECDHKeyPair, 
  deriveSessionKey, 
  exportPublicKey, 
  importPublicKey, 
  encryptMessage, 
  decryptMessage 
} from './services/crypto';
import { AppState, Contact, ChatMessage, MessageType } from './types';
import { IconShield } from './components/Icons';

// Polyfill for crypto.randomUUID if missing (e.g. insecure context)
if (!('randomUUID' in crypto)) {
  // @ts-ignore
  crypto.randomUUID = function() {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
      (Number(c) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> (Number(c) / 4)).toString(16)
    );
  };
}

const ID_REGEX = /^[0-9]{10}[a-z]{2,4}$/;
const dbService = new LocalStorageService();

function App() {
  const [appState, setAppState] = useState<AppState>({
    view: 'setup',
    myId: '',
    secretPhrase: '',
    activeChatId: null,
    identityKey: null,
  });

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectStatus, setConnectStatus] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [partnerOnline, setPartnerOnline] = useState(false);

  // Services
  const signaling = useRef<SignalingClient | null>(null);
  const rtc = useRef<WebRTCService | null>(null);
  
  // State
  const sessionKey = useRef<CryptoKey | null>(null);
  const activeDataChannel = useRef<RTCDataChannel | null>(null);
  const pingInterval = useRef<any>(null);

  useEffect(() => {
    // Init DB
    dbService.initDb();

    // Auto-login check
    const storedId = localStorage.getItem('eptp_id');
    const storedSec = localStorage.getItem('eptp_sec');
    if (storedId && storedSec) {
      handleLogin(storedId, storedSec);
    } else {
      setInitializing(false);
    }
    
    // SW
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').catch(console.warn);
    }

    return () => {
      cleanupConnection();
      if (signaling.current) signaling.current.close();
    };
  }, []);

  const cleanupConnection = () => {
      if (rtc.current) {
          rtc.current.close();
          rtc.current = null;
      }
      if (activeDataChannel.current) {
          activeDataChannel.current.close();
          activeDataChannel.current = null;
      }
      clearInterval(pingInterval.current);
      setPartnerOnline(false);
      sessionKey.current = null;
  };

  // --- LOGIN & SIGNALING INIT ---

  const handleLogin = async (idInput: string, phrase: string) => {
    setInitializing(true);
    try {
        const cleanId = idInput.replace(/[\s-]/g, '').toLowerCase();
        
        if (!ID_REGEX.test(cleanId)) {
            alert("Invalid ID format");
            setInitializing(false);
            return;
        }

        const key = await deriveIdentityKey(phrase);
        
        setAppState(prev => ({
            ...prev,
            view: 'chatList',
            myId: cleanId,
            secretPhrase: phrase,
            identityKey: key
        }));

        localStorage.setItem('eptp_id', cleanId);
        localStorage.setItem('eptp_sec', phrase);

        // Initialize Signaling
        signaling.current = new SignalingClient(cleanId);
        
        signaling.current.onStatus((status) => {
            setIsOnline(status === 'connected');
        });

        signaling.current.onMessage((msg) => handleSignalMessage(msg));

    } catch (error) {
        console.error("Login failed:", error);
        alert("Startup failed. Ensure you are using HTTPS or Localhost.");
    } finally {
        setInitializing(false);
    }
  };

  // --- SIGNAL HANDLING ---

  const handleSignalMessage = (msg: SignalMessage) => {
      if (msg.type === 'incoming_chat') {
          console.log(`[App] Incoming chat request from ${msg.from}`);
          // If we aren't already busy connecting to someone else...
          if (!rtc.current || rtc.current.partnerId !== msg.from) {
              // Switch view immediately for better UX
              setAppState(prev => ({ ...prev, activeChatId: msg.from, view: 'chatRoom' }));
              loadChatHistory(msg.from);
              startWebRTC(msg.from);
          }
      }
      // If we receive an Offer but have no RTC instance, implies we are Answerer and missed 'incoming_chat'
      else if (msg.type === 'offer') {
          if (!rtc.current || rtc.current.partnerId !== msg.from) {
              console.log('[App] Received Offer without RTC instance. Creating Answerer.');
              // Switch view immediately
              setAppState(prev => ({ ...prev, activeChatId: msg.from, view: 'chatRoom' }));
              loadChatHistory(msg.from);
              startWebRTC(msg.from);
          }
          // Defer handling slightly to ensure RTC instance is ready
          setTimeout(() => rtc.current?.handleSignal(msg), 100);
      }
      else {
          rtc.current?.handleSignal(msg);
      }
  };

  // --- WEBRTC CONNECTION FLOW ---

  const startChat = (partnerId: string) => {
    if (partnerId === appState.myId) return;
    
    // Immediate UI update
    setConnectStatus('Connecting...');
    setShowConnectModal(false);
    setAppState(prev => ({ ...prev, activeChatId: partnerId, view: 'chatRoom' }));
    loadChatHistory(partnerId);
    
    // Notify partner via Signaling Server
    if (signaling.current) {
        signaling.current.send({ type: 'start_chat', from: appState.myId, to: partnerId });
    }

    startWebRTC(partnerId);
  };

  const startWebRTC = (partnerId: string) => {
    cleanupConnection();

    console.log(`[App] Starting WebRTC with ${partnerId}`);
    setConnectStatus('Connecting...');
    
    rtc.current = new WebRTCService(
        appState.myId,
        partnerId,
        signaling.current!,
        (state) => {
             console.log(`[App] Connection State: ${state}`);
             if (state === 'connected') {
                 setConnectStatus('Securing...');
             } else if (state === 'failed') {
                 setConnectStatus('Failed. Retrying...');
             } else {
                 setConnectStatus('Connecting...');
             }
        },
        (dc) => setupDataChannel(dc, partnerId)
    );

    rtc.current.start();
  };

  const setupDataChannel = async (dc: RTCDataChannel, partnerId: string) => {
    activeDataChannel.current = dc;
    
    dc.onopen = async () => {
        console.log('[DataChannel] OPEN. Key Exchange.');
        
        try {
            const keyPair = await generateECDHKeyPair();
            const pubKeyJwk = await exportPublicKey(keyPair.publicKey);
            
            dc.send(JSON.stringify({ type: 'key_exchange', key: pubKeyJwk }));
            (dc as any).tempPrivateKey = keyPair.privateKey;
        } catch (e) {
            console.error("Key Exchange Init Failed", e);
            setConnectStatus("Encryption Failed");
        }
    };

    dc.onmessage = async (event) => {
        try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'key_exchange') {
                const partnerKey = await importPublicKey(data.key);
                const privateKey = (dc as any).tempPrivateKey;
                sessionKey.current = await deriveSessionKey(privateKey, partnerKey);
                
                setConnectStatus('');
                setPartnerOnline(true);
                startPing(dc);
            }
            else if (data.iv && data.data) {
                if (sessionKey.current) {
                    const decryptedJson = await decryptMessage(data, sessionKey.current);
                    const msg: ChatMessage = JSON.parse(decryptedJson);
                    handleIncomingChatMessage(msg);
                }
            }
            else if (data.type === 'ping') dc.send(JSON.stringify({ type: 'pong' }));
            else if (data.type === 'pong') setPartnerOnline(true);
            else if (data.type === 'read_receipt') {
                setActiveMessages(prev => prev.map(m => m.id === data.messageId ? { ...m, status: 'read' } : m));
            }
        } catch (e) { console.error(e); }
    };
    
    dc.onclose = () => {
        console.warn('[DataChannel] CLOSED');
        setPartnerOnline(false);
        setConnectStatus('Disconnected');
    };
  };

  const startPing = (dc: RTCDataChannel) => {
      clearInterval(pingInterval.current);
      pingInterval.current = setInterval(() => {
          if (dc.readyState === 'open') dc.send(JSON.stringify({ type: 'ping' }));
      }, 10000);
  };

  // --- MESSAGING ---

  const loadChatHistory = async (partnerId: string) => {
     const chatId = [appState.myId, partnerId].sort().join('::');
     const history = await dbService.getMessages(chatId);
     setActiveMessages(history);
  };

  const handleIncomingChatMessage = (msg: ChatMessage) => {
      dbService.saveMessage(msg);
      
      if (appState.activeChatId === msg.from) {
          setActiveMessages(prev => [...prev, msg]);
          if (activeDataChannel.current?.readyState === 'open') {
              activeDataChannel.current.send(JSON.stringify({ type: 'read_receipt', messageId: msg.id }));
          }
      } else {
          if (document.hidden && Notification.permission === 'granted') new Notification("New Secure Message");
      }
      updateContactList(msg.from, msg.type === MessageType.IMAGE ? 'Image' : msg.text, msg.timestamp);
  };

  const handleSendMessage = async (text: string, type: MessageType) => {
      const partnerId = appState.activeChatId;
      if (!partnerId) return;
      
      // Check connection
      if (!activeDataChannel.current || activeDataChannel.current.readyState !== 'open' || !sessionKey.current) {
          console.warn("Attempting to send while disconnected, reconnecting...");
          startChat(partnerId);
          // Optionally queue message or alert user
          return;
      }

      const chatId = [appState.myId, partnerId].sort().join('::');
      const msg: ChatMessage = {
          id: crypto.randomUUID(),
          chatId,
          from: appState.myId,
          to: partnerId,
          timestamp: Date.now(),
          type,
          text: type === MessageType.IMAGE ? text : text, 
          status: 'sent'
      };

      const encrypted = await encryptMessage(JSON.stringify(msg), sessionKey.current);
      activeDataChannel.current.send(JSON.stringify(encrypted));
      
      await dbService.saveMessage(msg);
      setActiveMessages(prev => [...prev, msg]);
      updateContactList(partnerId, text, msg.timestamp);
  };

  const updateContactList = (contactId: string, lastMsg: string, time: number) => {
      setContacts(prev => {
          const idx = prev.findIndex(c => c.id === contactId);
          if (idx >= 0) {
              const updated = [...prev];
              updated[idx].lastMessage = lastMsg;
              updated[idx].lastMessageTime = time;
              return updated;
          } else {
              return [...prev, { id: contactId, name: contactId, lastMessage: lastMsg, lastMessageTime: time }];
          }
      });
  };

  // --- RENDER ---

  if (initializing) return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center">
          <IconShield className="w-16 h-16 text-blue-500 animate-pulse" />
      </div>
  );

  if (appState.view === 'setup') return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950 p-6">
          <div className="w-full max-w-sm bg-slate-900 p-8 rounded-xl border border-slate-800">
              <div className="text-center mb-8">
                  <IconShield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-white mb-2">EPTP</h1>
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Secure P2P Messenger</p>
              </div>
              <form onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  handleLogin(fd.get('id') as string, fd.get('phrase') as string);
              }} className="space-y-4">
                  <div>
                      <label className="text-xs text-slate-400 font-bold uppercase">Mobile ID</label>
                      <input name="id" required className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white mt-1" placeholder="9876543210abc" />
                  </div>
                  <div>
                      <label className="text-xs text-slate-400 font-bold uppercase">Secret Phrase</label>
                      <input name="phrase" type="password" required className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white mt-1" />
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded">Login</button>
              </form>
          </div>
      </div>
  );

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-slate-950 flex items-center justify-center">
      <div className="w-full h-full max-w-md bg-slate-900 relative border-x border-slate-800 flex flex-col shadow-2xl">
        
        {appState.view === 'chatList' && (
            <ChatList 
                contacts={contacts}
                myId={appState.myId}
                isOnline={isOnline}
                onSelectContact={(c) => {
                    // Immediate Switch
                    setAppState(p => ({ ...p, activeChatId: c.id, view: 'chatRoom' }));
                    loadChatHistory(c.id);
                    startChat(c.id);
                }}
                onNewConnection={() => setShowConnectModal(true)}
                onLogout={() => {
                    localStorage.removeItem('eptp_sec');
                    window.location.reload();
                }}
            />
        )}

        {appState.view === 'chatRoom' && appState.activeChatId && (
            <ChatRoom 
                contact={{ id: appState.activeChatId, name: appState.activeChatId }}
                messages={activeMessages}
                myId={appState.myId}
                isPartnerOnline={partnerOnline}
                onSendMessage={handleSendMessage}
                onImageSelect={async (file) => {
                    const reader = new FileReader();
                    reader.onload = () => handleSendMessage(reader.result as string, MessageType.IMAGE);
                    reader.readAsDataURL(file);
                }}
                onBack={() => {
                    cleanupConnection();
                    setAppState(p => ({ ...p, view: 'chatList', activeChatId: null }));
                }}
            />
        )}

        {showConnectModal && (
            <Connect 
                onStartConnection={startChat}
                onCancel={() => setShowConnectModal(false)}
                status={connectStatus}
            />
        )}

      </div>
    </div>
  );
}

export default App;