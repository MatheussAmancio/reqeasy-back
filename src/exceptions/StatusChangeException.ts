import { HttpException } from './HttpException'

export class StatusChangeExcepetion extends HttpException {
  constructor() {
    super(400, "Cannot change status")
  }
}