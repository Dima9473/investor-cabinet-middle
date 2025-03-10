import { AccountsDTO } from "../types/accounts"

export const validateBankAccounts = (accounts: AccountsDTO) => {
    if (!Array.isArray(accounts) || accounts.some(account => !account.id)) throw new Error(`invalid account: ${accounts}`)

    return true
}
