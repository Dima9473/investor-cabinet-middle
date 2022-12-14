import { getReposAsync, getGitUser } from '../fetch'

import { UserInfo } from "../../types/UserInfo.types"
import { adaptGitRepos } from '../../adapters/repo'
import { adaptGitUser } from '../../adapters/user'

export const getUserInfo = async (userName: string): Promise<UserInfo> => {
    const gitRepos = await getReposAsync(userName)
    const gitUser = await getGitUser(userName)

    const repos = adaptGitRepos(gitRepos.data)
    const user = adaptGitUser(gitUser.data)

    const userInfo: UserInfo = {
        companyName: user?.companyName ?? '',
        repos
    }

    return userInfo
}