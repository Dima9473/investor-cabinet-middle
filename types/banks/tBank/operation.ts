import { z } from "zod";
import { operationSchema } from "../../../zodSchemas/operations/operation";

export type Operation = z.infer<typeof operationSchema>

export type Operations = Operation[]

