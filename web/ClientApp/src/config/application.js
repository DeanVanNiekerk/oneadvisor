
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
    createApplication(DIRECTORY_ID, "Directory", "#03a9f4", "/directory", "security"),
    createApplication(MEMBER_ID, "Member", "#009688", "/member", "account_circle")
]



