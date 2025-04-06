// models/validator.ts

import { accountSchema } from '../../zodSchemas/account';
import { operationSchema } from '../../zodSchemas/operations/operation';

import { validate } from '../validate';

export const validateAccount = validate(accountSchema);

export const validateOperation = validate(operationSchema);
