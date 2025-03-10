import axios, { AxiosRequestConfig } from "axios";
import HttpStatus from 'http-status'

type RequestResultProps = {
    data: any,
    status: number
}

const getAsync = async (url: string, config?: AxiosRequestConfig) => {
    const promise = await axios.get(url, config);
    const status = promise.status;
    const data = status === HttpStatus.OK ? promise.data : null

    return { data, status }
}

const postAsync = async (url: string, dataBody: any = {}, config?: AxiosRequestConfig) => {
    const promise = await axios.post(url, dataBody, {headers: {        'Authorization': 'Bearer t.97YGmTZ6hUUSfXjI2EYrm_Ls-9bcP4KXp0oAvKNgT74ToQWHIBnEl2uMUWJ_JwiQNDW3u7ofO_3qJnRiMIdCRg',
        'accept': 'application/json',
        'Content-Type': 'application/json'}});
    const status = promise.status;
    const data = status === HttpStatus.OK ? promise.data : null

    return { data, status }
}

export const getAccountsTBank = async (token: string): Promise<RequestResultProps> => { 
    const result = await postAsync("https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.UsersService/GetAccounts", {headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }})

    return { ...result }
}
