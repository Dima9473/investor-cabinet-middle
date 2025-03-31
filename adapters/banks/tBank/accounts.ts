import { Accounts } from "../../../types/banks/tBank/accounts";
import { AccountsResponse } from "../../../types/banks/tBank/responses/accountsResponse";
import { validateBankAccounts } from "../../../validation/banks/tBank/account";

export const adaptBankAccounts = (bankAccounts: AccountsResponse | null): Accounts | null => {
    if (!validateBankAccounts(bankAccounts)) return null

    const accounts: Accounts = bankAccounts.accounts

    return accounts
}
