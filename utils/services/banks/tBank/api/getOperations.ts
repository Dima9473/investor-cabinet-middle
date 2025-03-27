import { RequestResultProps } from "../../../../../types/fetch"
import { postAsync } from "../../../../fetch"

export const getOperations = async <T>(token: string, body: unknown): Promise<RequestResultProps<T>> => { 
    const result = await postAsync<T>({
        url: "https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.OperationsService/GetOperations",
        body,
        config: {
            headers: {        
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }}
    })
    return { ...result }
}
