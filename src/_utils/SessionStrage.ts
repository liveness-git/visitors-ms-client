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
