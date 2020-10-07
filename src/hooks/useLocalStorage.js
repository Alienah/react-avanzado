import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Lo tenemos que parsear para que en vez de string nos devuelva el valor true o false
      return item != null ? JSON.parse(item) : initialValue;
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error(error);
      return false;
    }
  });

  const setLocalStorage = (value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setValue(value);
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error(error);
    }
  };

  return [storedValue, setLocalStorage];
}
