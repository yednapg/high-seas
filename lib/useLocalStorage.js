import { useState } from "react"

function getFromLocalStorage(key) {
  const value = localStorage.getItem(key);
  if (value) return JSON.parse(value);
}

function setToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function useLocalStorageState(key, initialValue) {
  const [stateValue, setStateValue] = useState(getFromLocalStorage(key) || initialValue)

  const setValue = value => {
    setToLocalStorage(key, value)
    setStateValue(value)
  }

  return [stateValue, setValue]
}

export default useLocalStorageState