import { z } from "zod";
import { operationSchema } from "../../../../zodSchemas/operations/operation";

export type OperationDTO = z.infer<typeof operationSchema>

export type OperationsDTO = OperationDTO[]
