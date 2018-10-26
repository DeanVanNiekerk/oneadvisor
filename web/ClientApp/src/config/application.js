
export const DIRECTORY_ID = "DIRECTORY";
export const MEMBER_ID = "MEMBER";

export const DEFAULT_APPLICATION_ID = DIRECTORY_ID;

const createApplication = (id, name, color, relativePath, icon) => ({
    id,
    name,
    color,
    relativePath,
    icon
})

export const applications = [
    createApplication(DIRECTORY_ID, "Directory", "#3949ab", "/directory", "security"),
    createApplication(MEMBER_ID, "Member", "#00897b", "/member", "account_circle")
]



