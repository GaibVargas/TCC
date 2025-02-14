import { FastifyReply, FastifyRequest } from "fastify"
import { userVerify } from "../../auth/services"
import { z } from "zod"
import quizServices from "../quiz/services"
import { SessionsManager } from "./sessions-manager"

const create_session_payload_schema = z.object({
  quiz_public_id: z.string(),
  mode: z.string(),
})

export async function createSession(
  req: FastifyRequest,
  _reply: FastifyReply,
): Promise<string> {
  userVerify(req.user)
  const session = create_session_payload_schema.parse(req.body)
  const quiz = await quizServices.getQuiz(session.quiz_public_id)
  const sessions_manager = SessionsManager.getInstance()
  return sessions_manager.newSession(req.user, quiz)
}

const sessionControllers = {
  createSession,
}

export default sessionControllers