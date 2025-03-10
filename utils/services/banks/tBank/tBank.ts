import { adaptBankAccounts } from "../../../../adapters/banks/tBank/accounts";
import { AccountsResponse, Accounts } from "../../../../types/banks/tBank/accounts";
import { IBankServices } from "../../../../types/banks/bankServices";
import { postAsync } from "../../../fetch";
import { RequestResultProps } from "../../../../types/fetch";

export const getAccountsTBank = async <T>(token: string): Promise<RequestResultProps<T>> => { 
    const result = await postAsync<T>("https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.UsersService/GetAccounts", {headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }})

    return { ...result }
}

export class TBank implements IBankServices {
    async getAccountsInfo(token: string): Promise<unknown[]> {
        const { data } = await getAccountsTBank<AccountsResponse>(token)
    
        const accounts = adaptBankAccounts(data);
    
        const userInfo: Accounts = accounts ?? []
    
        return userInfo
    }
}
