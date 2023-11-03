import React from 'react';
import cookieUtils from 'utils/cookieUtils';
function useCookieState(
  key,
  defaultValue = '',
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
) {
  const [storedValue, setStoredValue] = React.useState(() => {
    const valueInCookie = cookieUtils.getCookie(key);
    if (valueInCookie) {
      try {
        return deserialize(valueInCookie);
      } catch (error) {
        return valueInCookie;
      }
    }
    return defaultValue instanceof Function ? defaultValue() : defaultValue;
  });

  const prevKeyRef = React.useRef(key);

  React.useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      cookieUtils.removeCookie(key);
    }
    prevKeyRef.current = key;

    cookieUtils.setCookie(key, serialize(storedValue));
  }, [key, storedValue, serialize]);

  return [storedValue, setStoredValue];
}

export { useCookieState };
