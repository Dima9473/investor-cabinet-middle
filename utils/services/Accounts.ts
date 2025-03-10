import { getAccountsTBank } from '../fetch'

import { Accounts, AccountsResponse } from '../../types/accounts'
import { adaptBankAccounts } from '../../adapters/accounts'

export const getAccountsInfo = async (token: string): Promise<Accounts> => {
    const { data } = await getAccountsTBank<AccountsResponse>(token)

    const accounts = adaptBankAccounts(data.accounts);

    const userInfo: Accounts = accounts ?? []

    return userInfo
}
