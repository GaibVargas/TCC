// Define types for Socket.IO events

export interface ServerToClientEvents {
  message: (payload: { text: string, timestamp: number }) => void
}

export interface ClientToServerEvents {
  join: (payload: {
    session_code: string
    user_public_id: string
  }) => Promise<void>
}