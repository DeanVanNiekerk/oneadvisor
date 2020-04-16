import { lazy } from "react";

export const Activate = lazy(() =>
    import(/* webpackChunkName: "account" */ "@/ui/account/Activate")
);
export const ResetPassword = lazy(() =>
    import(/* webpackChunkName: "account" */ "@/ui/account/ResetPassword")
);
export const ResetPasswordRequest = lazy(() =>
    import(/* webpackChunkName: "account" */ "@/ui/account/ResetPasswordRequest")
);
export const SignIn = lazy(() => import(/* webpackChunkName: "account" */ "@/ui/account/SignIn"));
