import { User } from "../types/User.types";
import { validateGitUser } from "../validation/user";

export const adaptGitUser = (gitUser: any): User | null => {
    if (!validateGitUser(gitUser)) return null

    const user: User = {
        companyName: gitUser.company
    }

    return user
}