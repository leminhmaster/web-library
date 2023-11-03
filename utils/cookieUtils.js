import Cookies from 'js-cookie';

const cookieUtils = {
  getCookie: key => Cookies.get(key),
  setCookie: (key, value) => {
    Cookies.set(key, value);
  },
  removeCookie: key => {
    Cookies.remove(key);
  },
};

export default cookieUtils;
