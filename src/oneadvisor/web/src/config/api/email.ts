import config from "@/config/config";

const emailBaseApi = `${config.baseApi}/api/email`;

export const sendWelcomeEmailApi = `${emailBaseApi}/sendWelcomeEmail`;
