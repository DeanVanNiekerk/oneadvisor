import config from "./config";

const directoryBaseApi = `${config.baseApi}/api/directory`;

export const changeLogsApi = `${directoryBaseApi}/changeLogs?filters=${encodeURIComponent('published=true')}`;
export const changeLogLatestApi = `${directoryBaseApi}/changeLogs/latest`;

const emailBaseApi = `${config.baseApi}/api/email`;

export const requestDemoEmailApi = `${emailBaseApi}/requestDemo`;