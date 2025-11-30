
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  READ_RECEIPT = 'read_receipt',
  PING = 'ping',
  PONG = 'pong'
}

export interface EncryptedPayload {
  iv: number[]; // Array from Uint8Array
  data: string; // Base64
  authTag?: number[];
}

export interface ChatMessage {
  id: string;
  chatId: string; // sorted(userId, partnerId)
  from: string;
  to: string;
  timestamp: number;
  type: MessageType;
  text: string; // Decrypted content
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface Contact {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: number;
  isOnline?: boolean;
}

export interface AppState {
  view: 'setup' | 'chatList' | 'chatRoom';
  myId: string;
  secretPhrase: string;
  activeChatId: string | null;
  identityKey: CryptoKey | null;
}
