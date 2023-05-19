import React, { useCallback } from "react"
import useLocalStorage from "../hooks/useLocalStorage.js"
import { isTokenExpired } from "../utils/jwtUtils.js"

export const UserContext = React.createContext({
  user: null,
  accessToken: null,
  authenticate: (accessToken, user) => { },
  logout: () => { },
  isAuthenticated: () => { }
})

export default function UserContextProvider({ children }) {
  const [user, setUser] = useLocalStorage("RT_USER", null)
  const [accessToken, setAccessToken] = useLocalStorage("RT_ACCESS_TOKEN", null)

  const authenticate = (accessToken, user) => {
    setUser(user);
    setAccessToken(accessToken);
    console.log("userContext authenticate", accessToken, user)
  }

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    console.log("userContext logout")
  }

  const isAuthenticated = () => {
    const accessToken = localStorage.getItem("RT_ACCESS_TOKEN");
    return accessToken != null && accessToken !== "" && !isTokenExpired(accessToken)
  }

  const contextValue = {
    user: user,
    accessToken: accessToken,
    isAuthenticated: useCallback(() => isAuthenticated(), []),
    authenticate: useCallback((accessToken, user) => authenticate(accessToken, user), []),
    logout: useCallback(() => logout(), [])
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}