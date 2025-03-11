import axios, { AxiosRequestConfig } from "axios";
import HttpStatus from 'http-status'
import { PostRequest } from "../types/fetch";

export const getAsync = async (url: string, config?: AxiosRequestConfig) => {
    const promise = await axios.get(url, config);
    const status = promise.status;
    const data = status === HttpStatus.OK ? promise.data : null

    return { data, status }
}

export const postAsync = async <T>(props: PostRequest) => {
    const {url, body = {}, config} = props

    const promise = await axios.post<T>(url, body, config);
    const status = promise.status;
    const data = status === HttpStatus.OK ? promise.data : null

    return { data, status }
}
