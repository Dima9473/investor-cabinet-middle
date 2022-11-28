import { Repo, Repos } from "../types/Repo.types"
import { validateGitRepo } from "../validation/repo"

export const adaptGitRepo = (gitRepo: any): Repo | null => {
    if (!validateGitRepo(gitRepo))
        return null

    const repo: Repo = {
        name: gitRepo.name,
        description: gitRepo.description,
        url: gitRepo.html_url
    }
    return repo
}

export const adaptGitRepos = (gitRepos: any[]): Repos => {
    const repos: Repos = []

    for (const gitRepo of gitRepos) {
        const repo: Repo | null = adaptGitRepo(gitRepo)
        if (!repo) break
        repos.push(repo)
    }

    return repos
}