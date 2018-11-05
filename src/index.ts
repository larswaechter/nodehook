import { createServer } from 'http'
import { listen } from 'socket.io'

import { Server } from './server'
import { variables } from './config/globals'

// init express server
const app = new Server()
app.start()
