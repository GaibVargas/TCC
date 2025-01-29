import { FastifyReply, FastifyRequest } from 'fastify'
import { LTIServices } from './services'
import {
  LoggedUserTokens,
  loginUser,
  updateOrCreateUser,
} from '../entities/user/services'

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
    _res: FastifyReply,
  ): Promise<LoggedUserTokens> {
    const ltiUser = await this.ltiService.getUser(req.body)
    const user = await updateOrCreateUser(ltiUser)
    return await loginUser(user)
  }
}
