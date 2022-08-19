import axios from "axios";
import HttpStatus from 'http-status'

type RequestResultProps = {
    data: any,
    status: number
}

const getDataAsync = async (url: string) => {
    const promise = await axios.get(url);
    const status = promise.status;
    const data = status === HttpStatus.OK ? promise.data : null

    return { data, status }
}

export const getReposAsync = async (userName: string): Promise<RequestResultProps> => {
    const result = await getDataAsync(`https://api.github.com/users/${userName}/repos`)

    return { ...result }
}

export const getGitUser = async (userName: string): Promise<RequestResultProps> => {
    const result = await getDataAsync(`https://api.github.com/users/${userName}`)

    return { ...result }
}

export const getRepoInteractionLimitsAsync = async (userName: string, repo: string): Promise<RequestResultProps> => {
    const result = await getDataAsync(`https://api.github.com/repos/${userName}/${repo}/interaction-limits`)
    return { ...result }
}