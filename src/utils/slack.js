const { WebClient } = require('@slack/web-api');
const { SocketModeClient } = require('@slack/socket-mode');

export const client = new WebClient(process.env.TOKEN);

const appToken = process.env.APP_TOKEN;
export const socketModeClient = new SocketModeClient({ appToken });
