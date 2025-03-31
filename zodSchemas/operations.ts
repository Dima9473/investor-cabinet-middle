import { z } from "zod";
import { operationSchema } from "./operation";

export const operationsSchema = z.array(operationSchema)
