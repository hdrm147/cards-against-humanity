import {GameManager} from "./classes/gameManager";
import * as SocketIO from "~/node_modules/@types/socket.io";

const express = require('express')
const consola = require('consola')
const {Nuxt, Builder} = require('nuxt')
const app = express()
const bodyParser = require("body-parser");

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

let manager = new GameManager;

// Require API routes
const routes = require('./routes/api');

// Import API Routes
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/api', routes(manager));

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const {host, port} = nuxt.options.server;

  await nuxt.ready();

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  const http = app.listen(port, host);
  const io: SocketIO.Server = require('socket.io')(http);


  manager.setSocket(io);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start();
