import 'dotenv-safe/config'

import { client, socketModeClient } from './utils/slack'

import cron from "cron";
import fetch from 'node-fetch'

//listen for messages 
socketModeClient.on('message', async ({ event }) => {
  await client.reactions.add({
    timestamp: event.ts,
    name: 'thumbsdown',
    channel: event.channel
  })
  console.log('Reaction added')
});

//start listening for messages
(async () => {
  await socketModeClient.start();
})();

//prevent heroku from sleeping
const cronJob = new cron.CronJob("0 */25 * * * *", () => {
  fetch("https://clava-slack-app.herokuapp.com/")
    .then((res) =>
      console.log(`response-ok: ${res.ok}, status: ${res.status}`)
    )
    .catch((error) => console.log(error));
});

//start cron job
cronJob.start();