import { z } from 'zod'
import { accountSchema } from '../../../../zodSchemas/account'

export type AccountDTO = z.infer<typeof accountSchema> 

export type AccountsDTO = AccountDTO[]
