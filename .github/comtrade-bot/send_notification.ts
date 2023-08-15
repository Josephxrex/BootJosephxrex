const axios = require('axios');

const {
  // Repository's secrets
  REPOSITORY_NAME: repo,
  TELEGRAM_TOKEN: botToken,
  TELEGRAM_TO: chatId,
  TELEGRAM_THREAD_ID: messageThreadId,
  // Set the environment variables
  ACTION: action,
  COMMIT_MESSAGE: commitMessage,
  PR_URL: prUrl,
  PR_TITLE: prTitle,
  PR_AUTHOR: prAuthor,
  REQUESTED_REVIEWERS: requestedReviewers,
  REVIEW_USER: reviewUser,
} = process.env;

function constructMessage() {
  let message = '';
  switch (action) {
    case 'MERGE':
      message = `
<b>🤖 PR Merged! 🔥</b>

<b>${repo}</b>

<b>Last Commit:</b> ${commitMessage}

<b>Please Sync your branches!</b>`;
      break;

    case 'PR_READY':
      message = `
<b>🤖 Review Request! 📝</b>

<b>${repo}</b>

<b>PR:</b> ${prTitle}
<b>PR Author:</b> ${prAuthor}
<b>Requested Reviewers:</b> ${requestedReviewers}

<b>PR Link:</b> ${prUrl}`;
      break;

    case 'APPROVED':
      message = `
<b>🤖PR Approved! ✅</b>

<b>${repo}</b>

<b>PR Title:</b> ${prTitle}
<b>${reviewUser}</b> has approved the PR

<b>PR Link:</b> ${prUrl}`;
      break;

    case 'COMMENTED':
      message = `
<b>🤖PR Commented! 💬</b>

<b>${repo}</b>

<b>PR Title:</b> ${prTitle}
<b>${reviewUser}</b> has commented on the PR

<b>PR Link:</b> ${prUrl}`;
      break;
    case 'CHANGES':
      message = `
<b>🤖PR Changes Requested! 🚩</b>

<b>${repo}</b>

<b>PR Title:</b> ${prTitle}
<b>${reviewUser}</b> requested changes on the PR

<b>PR Link:</b> ${prUrl}`;
      break;
    default:
      throw new Error(`Unsupported action: ${action}`);
  }
  return message;
}

async function sendTelegramNotification() {
  const message = constructMessage();

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: message,
    message_thread_id: messageThreadId,
    parse_mode: 'HTML',
  };

  try {
    await axios.post(url, payload);
  } catch (error) {
    const { response } = error;

    if (response) {
      const errorDetails = JSON.stringify(response.data, null, 2);
      console.error(`HTTP Error: Status ${response.status}\n${errorDetails}`);
      process.exit(1);
    } else {
      const errorDetails = JSON.stringify(error, null, 2);
      console.error(`General Error: ${errorDetails}`);
      process.exit(1);
    }
  }
}

sendTelegramNotification();
