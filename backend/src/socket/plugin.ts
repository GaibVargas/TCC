import { FastifyPluginCallback } from 'fastify'
import { Server } from 'socket.io'
import { config } from '../config/env'
import { ClientToServerEvents, ServerToClientEvents } from './types'
import { SessionsManager } from '../entities/session/sessions-manager'

const sessions_manager = SessionsManager.getInstance()

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

    socket.on('instructor:join', async (payload) => {
      await socket.join(payload.session_code)
      sessions_manager.instructorEnterSession(payload.session_code, socket)
    })

    socket.on('join', async (payload) => {
      await socket.join(payload.session_code)
      io.to(payload.session_code).emit('new-participant')
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
