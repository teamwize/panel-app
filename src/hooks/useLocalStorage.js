import { useState } from "react";

// Hook
function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        if (value == null) {
          localStorage.removeItem(key);
        } else if (typeof value == 'object') {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        } else {
          localStorage.setItem(key, valueToStore);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
}

export default useLocalStorage;