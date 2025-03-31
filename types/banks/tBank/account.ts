
import { z } from "zod"
import { accountSchema } from "../../../zodSchemas/account"

export type Account = z.infer<typeof accountSchema>    
