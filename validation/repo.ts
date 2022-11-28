export const validateGitRepo = (gitRepo: any) => {
    const nameCondition = typeof gitRepo.name !== 'string'
    const descriptionCondition = typeof gitRepo.description !== 'object'
    const htmlUrlCondition = typeof gitRepo.html_url !== 'string'

    if (nameCondition || descriptionCondition || htmlUrlCondition) throw new Error('invalid repo')

    return true
}