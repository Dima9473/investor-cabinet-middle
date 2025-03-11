import { TOKEN } from "../../../../../lib/constants/auth"
import { RequestResultProps } from "../../../../../types/fetch"
import { postAsync } from "../../../../fetch"

export const getAccounts = async <T>(token: string): Promise<RequestResultProps<T>> => { 
    const result = await postAsync<T>({
        url: "https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.UsersService/GetAccounts",
        config: {
            headers: {        
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }}
    })

    return { ...result }
}
