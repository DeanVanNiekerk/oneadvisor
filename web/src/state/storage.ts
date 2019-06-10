export const getToken = (): string | null => {
    return localStorage.getItem("token");
};

export const setToken = (token: string | null) => {
    if (token !== null) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
};

export const getVersion = (): string | null => {
    return localStorage.getItem("version");
};

export const setVersion = (version: string | null) => {
    if (version !== null) localStorage.setItem("version", version);
    else localStorage.removeItem("version");
};
