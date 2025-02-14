import { FastifyPluginCallback } from 'fastify'
import { Server } from 'socket.io'
import { config } from '../config/env'
import { ClientToServerEvents, ServerToClientEvents } from './types'

const socketIOPlugin: FastifyPluginCallback = (
  fastify,
  _options,
  done,
) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(fastify.server, {
    cors: {
      origin: config.host.FRONTEND_URL,
    },
  })
  
  io.on('connection', (socket) => {
    console.log('Client connected')

    socket.on('join', async (payload) => {
      await socket.join(payload.session_code)
      console.log(`Client joined group: ${payload.session_code}`)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })

  fastify.decorate('io', io)

  done()
}

export default socketIOPlugin
