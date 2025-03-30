import { OperationsResponse } from "../../../types/banks/tBank/responses/operationsResponse"

export const validateBankOperations = (data: OperationsResponse | null): data is OperationsResponse => {
    if (!data) {
        throw new Error('accounts list is empty')
    }

    return true
}
