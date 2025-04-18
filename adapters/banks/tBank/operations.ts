import { OperationsInfo } from "../../../types/banks/operationsInfo";
import { Operations } from "../../../types/banks/tBank/operation";
import { OperationsResponse } from "../../../types/banks/tBank/responses/operationsResponse";
import { validateBankOperations } from "../../../validation/banks/tBank/operation";

export const adaptBankOperations = (bankOperations: OperationsResponse | null, accountId: string, bankName: string): OperationsInfo | null => {
    if (!validateBankOperations(bankOperations)) return null

    const operations: Operations = bankOperations.operations
    const operationsInfo: OperationsInfo = {
        accountId,
        operations: operations ?? [],
        bankName
    }

    return operationsInfo
}

