/**
 * login時のlocation設定を一時的に格納します
 */
const temp_key = 'liveness-visitor-temp';
export const saveTempLocation = (location: string) => {
  sessionStorage.setItem(temp_key, location);
};
export const getTempLocation = () => {
  return sessionStorage.getItem(temp_key);
};
export const removeTempLocation = () => {
  sessionStorage.removeItem(temp_key);
};
/**
 * user情報を格納します
 */
const user_key = 'liveness-visitor-user';
export const saveUserInfo = (user: string) => {
  sessionStorage.setItem(user_key, user);
};
export const getUserInfo = () => {
  return sessionStorage.getItem(user_key);
};
export const removeUserInfo = () => {
  sessionStorage.removeItem(user_key);
};
/**
 * reload用stage情報を格納します
 */
const reload_key = 'liveness-visitor-reload';
export const initReloadState = () => {
  sessionStorage.setItem(reload_key, `{}`);
};
export const saveReloadState = (item: string, value: string) => {
  const states = JSON.parse(sessionStorage.getItem(reload_key)!);
  states[item] = value;
  sessionStorage.setItem(reload_key, JSON.stringify(states));
};
export const getReloadState = (item: string): string => {
  const states = JSON.parse(sessionStorage.getItem(reload_key)!);
  return states[item];
};
export const removeReloadState = () => {
  sessionStorage.removeItem(reload_key);
};
/**
 * reload用stageを保持するか否かのフラグ
 */
const reloadFlg_key = 'liveness-visitor-reload-flg';
export const setReloadStateFlg = () => {
  sessionStorage.setItem(reloadFlg_key, '1');
};
export const getReloadStateFlg = () => {
  return sessionStorage.getItem(reloadFlg_key);
};
export const removeReloadStateFlg = () => {
  sessionStorage.removeItem(reloadFlg_key);
};
/**
 * SessionStrageの一括削除
 */
export const removeSessionStrage = () => {
  removeUserInfo();
  removeReloadState();
  removeReloadStateFlg();
};
