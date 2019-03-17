export const getToken = (): string | null => {
    return localStorage.getItem("token");
};

export const setToken = (token: string | null) => {
    if (token !== null) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
};
