import config from "./config";

const directoryBaseApi = `${config.baseApi}/api/directory`;

export const changeLogsApi = `${directoryBaseApi}/changeLogs`;
export const changeLogLatestApi = `${changeLogsApi}/latest`;

const emailBaseApi = `${config.baseApi}/api/email`;

export const requestDemoEmailApi = `${emailBaseApi}/requestDemo`;