import axios, { AxiosRequestConfig } from "axios";
import HttpStatus from 'http-status'

export const getAsync = async (url: string, config?: AxiosRequestConfig) => {
    const promise = await axios.get(url, config);
    const status = promise.status;
    const data = status === HttpStatus.OK ? promise.data : null

    return { data, status }
}

export const postAsync = async <T>(url: string, dataBody: any = {}, config?: AxiosRequestConfig) => {
    const promise = await axios.post<T>(url, dataBody, {headers: {        'Authorization': 'Bearer t.97YGmTZ6hUUSfXjI2EYrm_Ls-9bcP4KXp0oAvKNgT74ToQWHIBnEl2uMUWJ_JwiQNDW3u7ofO_3qJnRiMIdCRg',
        'accept': 'application/json',
        'Content-Type': 'application/json'}});
    const status = promise.status;
    const data = status === HttpStatus.OK ? promise.data : null

    return { data, status }
}
