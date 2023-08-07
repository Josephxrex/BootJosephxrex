import axios from 'axios';

async function sendTelegramNotification() {
  const botToken = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_TO;
  const messageThreadId = process.env.TELEGRAM_THREAD_ID;
  const githubServerUrl = process.env.GITHUB_SERVER_URL;
  const githubRepository = process.env.GITHUB_REPOSITORY;

  const prUrl = `${githubServerUrl}/${githubRepository}/pull`;
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
    if (response.status === 200) {
      console.log('Mensaje enviado con éxito');
    } else {
      console.error('Error al enviar el mensaje:', response.data);
    }
  } catch (error) {
    console.error('Error al enviar el mensaje:', error.message);
  }
}

sendTelegramNotification();
