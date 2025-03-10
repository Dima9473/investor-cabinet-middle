import { getAccountsTBank } from '../fetch'

import { Accounts } from '../../types/accounts'
import { adaptBankAccounts } from '../../adapters/accounts'

export const getAccountsInfo = async (token: string): Promise<Accounts> => {
    const bankAccounts = await getAccountsTBank(token)

    const accounts = adaptBankAccounts(bankAccounts);

    const userInfo: Accounts = accounts ?? []

    return userInfo
}
