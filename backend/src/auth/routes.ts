import { FastifyInstance } from "fastify"
import authController from "./controller"

export default function authRoutes(fastify: FastifyInstance, _options: unknown): void {
  fastify.post('/refresh', authController.refreshToken)
}