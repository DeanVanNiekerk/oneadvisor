export const ROLE_SUPER_ADMIN = "super_administrator";

export const hasRole = (roleId: string, roleIds: string[]) => {
    return roleIds.some((id) => id == roleId);
};
