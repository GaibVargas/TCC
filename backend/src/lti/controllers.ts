import { FastifyReply, FastifyRequest } from 'fastify'
import { LTIServices } from './services'
import { createUser } from '../entities/user/services'

export default class LTIControllers {
  private ltiService: LTIServices

  constructor(ltiService: LTIServices) {
    this.ltiService = ltiService
  }

  async startLauch(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const redirect_url = await this.ltiService.startLaunch(req.body)
    res.redirect(redirect_url)
  }

  async redirect(req: FastifyRequest, _res: FastifyReply): Promise<void> {
    const user = await this.ltiService.getUser(req.body)
    await createUser(user)
  }
}
