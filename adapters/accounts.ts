import { Accounts, AccountsDTO } from "../types/accounts";
import { validateBankAccounts } from "../validation/account";
export const adaptBankAccounts = (bankAccounts: AccountsDTO): Accounts | null => {
    if (!validateBankAccounts(bankAccounts)) return null

    const accounts: Accounts = bankAccounts

    return accounts
}
