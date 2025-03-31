import { z } from "zod";
import { operationSchema } from "../../../zodSchemas/operation";

export type Operation = z.infer<typeof operationSchema>

export type Operations = Operation[]

