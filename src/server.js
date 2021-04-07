import 'dotenv-safe/config'
import "reflect-metadata";

import express from "express";

const cors = require("cors");
const morgan = require('morgan')

// const message = require('./routes/message')

import { client, socketModeClient } from './utils/slack'

import cron from "cron";
import fetch from 'node-fetch'

const main = () => {
  const app = express();

  app.use(morgan("dev"));

  app.use(cors({ origin: "*" }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (_, res) => {
    res.send("Hello world");
  });

  // app.use('/api/v1/message', message)

  app.use((_, res) => {
    res.status(404).json({ status: "404" });
  });

  //listen for messages 
  socketModeClient.on('message', async ({ event }) => {
    await client.reactions.add({
      timestamp: event.ts,
      name: 'clava',
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

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
  });
}

main()

// import 'dotenv-safe/config'
// import { client, socketModeClient } from './utils/slack'


// //listen for messages 
// const main = async () => {
//   socketModeClient.on('message', async ({ event }) => {
//     await client.reactions.add({
//       timestamp: event.ts,
//       name: 'clava',
//       channel: event.channel
//     })
//     console.log('Reaction added')
//   });

//   //start listening for messages
//   await socketModeClient.start(process.env.PORT).then(() => {
//     console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
//   });
// }

// main()