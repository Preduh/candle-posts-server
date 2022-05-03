import { Request, Response } from "express"
import { prismaClient } from "../../database/prismaClient"
import { CreateUserService } from "../../services/CreateUserService"

export class CreateUserController {
  async handle(request: Request, response: Response) {
    const { username, email, password } = request.body

    const service = new CreateUserService()

    const result = await service.execute({ username, email, password })

    if (result instanceof Error)
      return response.status(400).json({ error: result.message })

    return response.json({ result })
  }
}
