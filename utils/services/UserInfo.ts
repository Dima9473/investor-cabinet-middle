import { getReposAsync, getGitUser } from '../fetch'

import { UserInfo } from "../types/UserInfo.types"
import { Repo, Repos } from "../types/Repo.types"

export const getUserInfo = async (userName: string) => {
    const { data: reposRaw } = await getReposAsync(userName)
    const { data: user } = await getGitUser(userName)

    const repos: Repos = []

    reposRaw?.forEach((element: any) => {

        const repo: Repo = {
            name: element.name,
            description: element.description,
            url: element.html_url
        }

        repos.push(repo)
    });

    const userInfo: UserInfo = {
        companyName: user.company,
        repos
    }

    return userInfo
}