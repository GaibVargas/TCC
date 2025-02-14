// Define types for Socket.IO events

export interface ServerToClientEvents {
  message: (payload: { text: string; timestamp: number }) => void
  'new-participant': (payload: void) => void
}

export interface ClientToServerEvents {
  'instructor:join': (payload: {
    session_code: string
    user_public_id: string
  }) => Promise<void>

  join: (payload: {
    session_code: string
    user_public_id: string
  }) => Promise<void>
}
