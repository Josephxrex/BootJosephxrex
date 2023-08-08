const axios = require('axios');

async function sendTelegramNotification() {
  const botToken = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_TO;
  const message= process.env.TELEGRAM_MESSAGE;
  const messageThreadId = process.env.TELEGRAM_THREAD_ID;
  const githubServerUrl = process.env.GITHUB_SERVER_URL;
  const githubRepository = process.env.GITHUB_REPOSITORY;
  const pullRequestNumber = process.env.PULL_REQUEST_NUMBER;
   

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: message,
    message_thread_id: messageThreadId,
    parse_mode: 'Markdown',
  };

  try {
    const response = await axios.post(url, payload);
    if (response.status === 200) {
      console.log('Mensaje enviado con éxito');
    } 
  } catch (error) {
   
  }
}

sendTelegramNotification();
