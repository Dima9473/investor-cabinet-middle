import { z } from "zod";
import { operationSchema } from "../../../../zodSchemas/operation";

export type OperationDTO = z.infer<typeof operationSchema>

export type OperationsDTO = OperationDTO[]
