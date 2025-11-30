
const WebSocket = require('ws');
const webpush = require('web-push');

// Configuration
const PORT = process.env.PORT || 8080;
const VAPID_PUBLIC = process.env.VAPID_PUBLIC || "BJp_X1...";
const VAPID_PRIVATE = process.env.VAPID_PRIVATE || "...";

if (process.env.VAPID_PUBLIC) {
    webpush.setVapidDetails('mailto:admin@eptp.app', VAPID_PUBLIC, VAPID_PRIVATE);
}

const wss = new WebSocket.Server({ port: PORT });
const clients = new Map(); // userId -> WebSocket
const subscriptions = new Map(); // userId -> PushSubscription

console.log(`Signaling Server running on port ${PORT}`);

wss.on('connection', (ws) => {
    let myUserId = null;

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'register') {
                myUserId = data.userId;
                clients.set(myUserId, ws);
                console.log(`Registered: ${myUserId}`);
            }
            else if (data.type === 'start_chat') {
                const target = clients.get(data.to);
                if (target && target.readyState === WebSocket.OPEN) {
                    target.send(JSON.stringify({ type: 'incoming_chat', from: data.from }));
                } else {
                    sendPush(data.to, "New Connection Request");
                }
            }
            else if (data.to) {
                // Forward signaling (offer, answer, ice)
                const target = clients.get(data.to);
                if (target && target.readyState === WebSocket.OPEN) {
                    target.send(JSON.stringify(data));
                } else if (data.type === 'offer') {
                    sendPush(data.to, "New Secure Message");
                }
            }
        } catch (e) {
            console.error(e);
        }
    });

    ws.on('close', () => {
        if (myUserId) clients.delete(myUserId);
    });
});

function sendPush(userId, text) {
    const sub = subscriptions.get(userId);
    if (sub) {
        webpush.sendNotification(sub, JSON.stringify({ title: "EPTP", body: text }))
            .catch(err => console.error("Push failed", err));
    }
}
