import { AccountsResponse } from "../../../types/banks/tBank/accounts"
import { OperationsResponse } from "../../../types/banks/tBank/operations"

export const validateBankOperations = (data: OperationsResponse | null): data is OperationsResponse => {
    if (!data) {
        throw new Error('accounts list is empty')
    }

    // const operations = data.operations

    // if (!Array.isArray(accounts) || accounts.some(account => !account.id)) throw new Error('invalid account')

    return true
}
