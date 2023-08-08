const axios = require("axios");

enum ACTIONS {
  MERGE = "MERGE",
  PR_READY = "PR_READY",
  APPROVED = "APPROVED",
  COMMENTED = "COMMENTED",
  CHANGES_REQUESTED = "CHANGES_REQUESTED",
}

// Repository secret
const repo = process.env.GITHUB_REPOSITORY;
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
    case ACTIONS.MERGE:
      message = `<b>🤖${repo} PR Merged!</b>
  <b>Title:</b> ${commitMessage}
  Sync your branches!`;
      break;
    case ACTIONS.PR_READY:
      message = `<b>🤖${repo}Review Request</b>
        <b>PR Link:</b> ${prUrl}
        <b>PR Title:</b> ${prTitle}
        <b>PR Author:</b> ${prAuthor}
        <b>Requested Reviewers:</b>${requestedReviewers} `;
      break;
    case ACTIONS.APPROVED:
      message = `<b>🤖${repo} PR approved</b>
    <b>${reviewUser}</b> has approved the PR: ${prUrl}`;
      break;
    case ACTIONS.COMMENTED:
      message = `<b>🤖${repo} PR commented!</b>
  <b>${reviewUser}</b> has commented on the PR: ${prUrl}`;
      break;
    case ACTIONS.CHANGES_REQUESTED:
      message = `<b>🤖${repo} PR changes requested!!</b>
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
