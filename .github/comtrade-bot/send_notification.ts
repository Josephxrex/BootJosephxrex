const axios = require("axios");

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
  let message = "";
  switch (action) {
    case "MERGE":
      message = `
<b>🤖${repo} PR Merged!</b>

<b>Title:</b> ${commitMessage}
<b>Sync your branches!</b>`;
      break;
    case "PR_READY":
      message = `
<b>🤖${repo} Review Request</b>

<b>PR Link:</b> ${prUrl}
<b>PR Title:</b> ${prTitle}
<b>PR Author:</b> ${prAuthor}
<b>Requested Reviewers:</b>${requestedReviewers} `;
      break;
    case "APPROVED":
      message = `
<b>🤖${repo} PR approved!</b>

<b>PR Title:</b> ${prTitle}
<b>${reviewUser}</b> has approved the PR: ${prUrl}`;
      break;
    case "COMMENTED":
      message = `
<b>🤖${repo} PR commented!</b>

<b>PR Title:</b> ${prTitle}
<b>${reviewUser}</b> has commented on the PR: ${prUrl}`;
      break;
    case "CHANGES":
      message = `
<b>🤖${repo} PR changes requested!</b>

<b>PR Title:</b> ${prTitle}
<b>${reviewUser}</b> requested changes on the PR:  ${prUrl}`;
      break;
    default:
      break;
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
    parse_mode: "HTML",
  };

  try {
    const response = await axios.post(url, payload);
    if (response.status !== 200) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }
  } catch (error) {
    console.error(
      `An error occurred while sending the Telegram message: ${error}`
    );
    throw error;
  }
}

sendTelegramNotification();
