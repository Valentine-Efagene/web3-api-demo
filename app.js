// https://www.toptal.com/express-js/nodejs-typescript-rest-api-pt-1
// https://www.toptal.com/express-js/nodejs-typescript-rest-api-pt-2
// https://www.toptal.com/express-js/nodejs-typescript-rest-api-pt-3

// https://blog.logrocket.com/interacting-smart-contracts-via-nodejs-api/
import express from "express"
import http from 'http'
import winston from 'winston'
import expressWinston from 'express-winston'
import cors from 'cors'
import debug from "debug"
import Web3 from 'web3'

import dotenv from 'dotenv';
const dotenvResult = dotenv.config();
if (dotenvResult.error) {
  throw dotenvResult.error;
}

import { UsersRoutes } from "./user/user.routes.config.js"
import { AuthRoutes } from "./auth/auth.routes.config.js"
import { ContactRoutes } from './contact/contact.routes.config.js'


const app = express()
const server = http.createServer(app)
const port = 3001
const routes = []
const debugLog = debug('app')

app.use(express.json())
app.use(cors())

const loggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  )
}

if (!process.env.DEBUG) {
  loggerOptions.meta = false // when not debugging, log requests as one-liners
  /*if (typeof global.it === 'function') {
    loggerOptions.level = 'http'; // for non-debug test runs, squelch entirely
  }*/
}

app.use(expressWinston.logger(loggerOptions))
routes.push(new AuthRoutes(app)) // independent: can go before or after UsersRoute
routes.push(new UsersRoutes(app))
routes.push(new ContactRoutes(app))

const runningMessage = `Server running at http://localhost:${port}`

app.get('/', (req, res) => {
  res.status(200).send(runningMessage)
})

export default server

server.listen(port, () => {
  debugLog('in')
  routes.forEach((route) => {
    debugLog(`Routes configured for ${route.getName()}`)
  })

  console.log(runningMessage)
})