import { Accounts } from "../../../types/banks/tBank/accounts";
import { Operations, OperationsResponse } from "../../../types/banks/tBank/operations";
import { validateBankOperations } from "../../../validation/banks/tBank/operation";

export const adaptBankOperations = (bankOperations: OperationsResponse | null): Operations | null => {
    if (!validateBankOperations(bankOperations)) return null

    const operations: Operations = bankOperations.operations

    return operations
}

