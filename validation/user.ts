export const validateGitUser = (gitUser: any) => {
    if (typeof gitUser.company !== 'string') throw new Error('invalid repo')

    return true
}