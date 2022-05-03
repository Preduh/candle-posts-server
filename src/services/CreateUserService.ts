import { Request, response, Response } from "express"
import { prismaClient } from "../database/prismaClient"
import { hash } from "bcrypt"
import { sign } from "jsonwebtoken"

type RequestDTO = {
  username: string
  email: string
  password: string
}

export class CreateUserService {
  async execute({ username, email, password }: RequestDTO) {
    if (username === "" || email === "" || password === "") {
      return new Error("Fill in all fields")
    }

    if (password.length < 6)
      return new Error("The password must contain at least 6 characters")

    const hashedPassword = await hash(password, 8)

    const usernameAlreadyExists = await prismaClient.user.findUnique({
      where: {
        username,
      },
    })

    if (usernameAlreadyExists)
      return new Error("This username is already in use")

    const emailAlreadyExists = await prismaClient.user.findUnique({
      where: {
        email,
      },
    })

    if (emailAlreadyExists) {
      return new Error("This email is already in use")
    }

    const user = await prismaClient.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    })

    const token = sign({}, process.env.JWT_SECRET, {
      expiresIn: "1d",
      subject: user.id,
    })

    return { user, token }
  }
}
