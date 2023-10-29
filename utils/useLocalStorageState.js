import React from 'react';

/**
 *
 * @param {String} key The key to set in localStorage for this value
 * @param {Object} defaultValue The value to use if it is not already in localStorage
 * @param {{serialize: Function, deserialize: Function}} options The serialize and deserialize functions to use (defaults to JSON.stringify and JSON.parse respectively)
 */

function useLocalStorageState(
  key,
  defaultValue = '',
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
) {
  const [storedValue, setStoredValue] = React.useState(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    const valueInLocalStorage = window.localStorage.getItem(key);
    if (valueInLocalStorage) {
      try {
        return deserialize(valueInLocalStorage);
      } catch (error) {
        return valueInLocalStorage;
      }
    }
    return defaultValue instanceof Function ? defaultValue() : defaultValue;
  });

  const prevKeyRef = React.useRef(key);

  React.useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey);
    }
    prevKeyRef.current = key;

    window.localStorage.setItem(key, serialize(storedValue));
  }, [key, storedValue, serialize]);

  return [storedValue, setStoredValue];
}

export { useLocalStorageState };
