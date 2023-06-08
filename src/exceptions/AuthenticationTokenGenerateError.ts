import { HttpException } from './HttpException'

export class AuthenticationTokenGenerateError extends HttpException {
  constructor() {
    super(401, "Authentication token generated error")
  }
}