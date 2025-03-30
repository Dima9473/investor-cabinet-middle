import { AccountsResponse } from "../../../types/banks/tBank/responses/accountsResponse"

export const validateBankAccounts = (data: AccountsResponse | null): data is AccountsResponse => {
    if (!data) {
        throw new Error('accounts list is empty')
    }

    const accounts = data.accounts

    if (!Array.isArray(accounts) || accounts.some(account => !account.id)) throw new Error('invalid account')

    return true
}
