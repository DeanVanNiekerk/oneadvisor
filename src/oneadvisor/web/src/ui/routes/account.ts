import { lazy } from "react";

export const Activate = lazy(() => import("@/ui/account/Activate"));
export const ResetPassword = lazy(() => import("@/ui/account/ResetPassword"));
export const ResetPasswordRequest = lazy(() => import("@/ui/account/ResetPasswordRequest"));
export const SignIn = lazy(() => import("@/ui/account/SignIn"));
