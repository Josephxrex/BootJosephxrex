const axios = require('axios');

async function sendTelegramNotification() {
  const botToken = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_TO;
  const messageThreadId = process.env.TELEGRAM_THREAD_ID;
  const githubServerUrl = process.env.GITHUB_SERVER_URL;
  const githubRepository = process.env.GITHUB_REPOSITORY;
  const pullRequestNumber = process.env.PULL_REQUEST_NUMBER;
   
  const prUrl = `${githubServerUrl}/${githubRepository}/pull/${pullRequestNumber}`;
  const message = `Nueva Pull Request abierta: ${prUrl}`;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: message,
    message_thread_id: messageThreadId,
    parse_mode: 'HTML',
  };

  try {
    const response = await axios.post(url, payload);
    if (response.status !== 200) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    } 
  } catch (error) {
    const err = error as Error;
    console.error(
      `An error occurred while sending the Telegram message: ${err}`
    );
    throw err;
  }
}

sendTelegramNotification();
