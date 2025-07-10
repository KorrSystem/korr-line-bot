const express = require('express');
const line = require('@line/bot-sdk');
const path = require('path');

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);
const app = express();
const port = process.env.PORT || 3000;

// ✅ 提供 /public 裡的靜態檔案（用來讀 liff.html）
app.use(express.static(path.join(__dirname, 'public')));

// ✅ LINE Webhook
app.post('/webhook', express.raw({ type: '*/*' }), line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.error('Error handling event:', err);
      res.status(500).end();
    });
});

// ✅ 處理文字訊息
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: 'Hello from Korr!',
  });
}

app.listen(port, () => {
  console.log(`LINE Bot running on port ${port}`);
});
