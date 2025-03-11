import { AxiosRequestConfig } from "axios"

export type RequestResultProps<T> = {
    data: T | null,
    status: number
}

export type PostRequest = {
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig
}
