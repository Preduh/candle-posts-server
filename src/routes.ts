import { Router } from "express"
import { CreateUserController } from "./controllers/User/CreateUserController"

const router = Router()

router.post("/create-user", new CreateUserController().handle)

export default router
