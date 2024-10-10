import { useState } from "react"

function getFromLocalStorage(key) {
  const item = localStorage.getItem(key);
  const obj = JSON.parse(item);
  if (obj) {
    if (obj.expiration && obj.expiration < Date.now()) {
      localStorage.removeItem(key)
      return null
    }

    if (obj.value) {
      return obj.value
    }
  }
}

function setToLocalStorage(key, value, expiration) {
  const objToSave = {value}
  if (expiration) {
    timeToExpire = Date.now() + expiration
    objToSave.expiration = timeToExpire
  }
  localStorage.setItem(key, JSON.stringify(objToSave));
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