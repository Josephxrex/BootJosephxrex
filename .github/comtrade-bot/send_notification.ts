const axios = require("axios");

// Repository's secrets
const repo = process.env.REPOSITORY_NAME;
const botToken = process.env.TELEGRAM_TOKEN;
const chatId = process.env.TELEGRAM_TO;
const messageThreadId = process.env.TELEGRAM_THREAD_ID;
// Set the environment variables
const action = process.env.ACTION;
const commitMessage = process.env.COMMIT_MESSAGE;
const prUrl = process.env.PR_URL;
const prTitle = process.env.PR_TITLE;
const prAuthor = process.env.PR_AUTHOR;
const requestedReviewers = process.env.REQUESTED_REVIEWERS;
const reviewUser = process.env.REVIEW_USER;

function constructMessage() {
  let message = "";
  switch (action) {
    case "MERGE":
      message = `<b>🤖${repo} PR Merged!</b><br>
      <b>Title:</b> ${commitMessage}<br>
      <b> Sync your branches!<b>`;
      break;
    case "PR_READY":
      message = `<b>🤖${repo}Review Request</b><br>
      <b>PR Link:</b> ${prUrl}
      <b>PR Title:</b> ${prTitle}
      <b>PR Author:</b> ${prAuthor}
      <b>Requested Reviewers:</b>${requestedReviewers} `;
      break;
    case "APPROVED":
      message = `<b>🤖${repo} PR approved</b><br>
      <b>${reviewUser}</b> has approved the PR: ${prUrl}`;
      break;
    case "COMMENTED":
      message = `<b>🤖${repo} PR commented!</b><br>
      <b>${reviewUser}</b> has commented on the PR: ${prUrl}`;
      break;
    case "CHANGES_REQUESTED":
      message = `<b>🤖${repo} PR changes requested!!</b><br>
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
