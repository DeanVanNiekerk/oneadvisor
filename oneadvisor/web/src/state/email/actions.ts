import { ApiAction, ApiOnFailure, ApiOnSuccess } from "@/app/types";
import { sendWelcomeEmailApi } from "@/config/api/email";

export const sendWelcomeEmail = (userId: string, onSuccess: ApiOnSuccess, onFailure: ApiOnFailure): ApiAction => ({
    type: "API",
    endpoint: `${sendWelcomeEmailApi}?userId=${userId}`,
    onSuccess: onSuccess,
    onFailure: onFailure,
});
