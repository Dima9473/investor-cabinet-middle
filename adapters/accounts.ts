import { Accounts } from "../types/accounts";
import { User } from "../types/User.types";
import { validateBankAccounts } from "../validation/account";
import { validateGitUser } from "../validation/user";

export const adaptBankAccounts = (bankAccounts: any): Accounts | null => {
    if (!validateBankAccounts(bankAccounts)) return null

    const accounts: Accounts = bankAccounts

    return accounts
}
