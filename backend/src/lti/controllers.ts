import { FastifyReply, FastifyRequest } from 'fastify'
import { LTIServices } from './services'
import {
  getUserAuthToken,
  updateOrCreateUser,
} from '../entities/user/services'
import { config } from '../config/env'

export default class LTIControllers {
  private ltiService: LTIServices

  constructor(ltiService: LTIServices) {
    this.ltiService = ltiService
  }

  async startLauch(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const LTI_REDIRECT_URL = await this.ltiService.startLaunch(req.body)
    res.redirect(LTI_REDIRECT_URL)
  }

  async login(
    req: FastifyRequest,
    res: FastifyReply,
  ): Promise<void> {
    const ltiUser = await this.ltiService.getUser(req.body)
    const user = await updateOrCreateUser(ltiUser)
    const auth_token = getUserAuthToken(user)
    res.redirect(`${config.host.FRONTEND_URL}/${auth_token}`)
  }
}
