import { useCallback, createContext, ReactNode } from "react"
import useLocalStorage from "../hooks/useLocalStorage"
import { isTokenExpired } from "../utils/jwtUtils";
import { UserResponse } from "~/constants/types";

type UserContextType = {
  user: UserResponse | null;
  accessToken: string | null;
  authenticate: (accessToken: string | null, user: UserResponse | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  accessToken: null,
  authenticate: () => { },
  logout: () => { },
  isAuthenticated: () => false
})

type UserContextProviderType = {
  children: ReactNode
}

export const UserContextProvider = ({ children }: UserContextProviderType) => {
  const [user, setUser] = useLocalStorage<UserResponse | null>("USER", null)
  const [accessToken, setAccessToken] = useLocalStorage<string | null>("ACCESS_TOKEN", null)

  const authenticate = (_accessToken: string | null, _user: UserResponse | null) => {
    setUser(_user);
    setAccessToken(_accessToken);
    console.log("userContext authenticate", accessToken, user)
  }

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    console.log("userContext logout")
  }

  const isAuthenticated = (): boolean => {
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    return accessToken != null && accessToken !== "" && !isTokenExpired(accessToken)
  }

  const contextValue = {
    user: user,
    accessToken: accessToken,
    isAuthenticated: useCallback(() => isAuthenticated(), [accessToken]),
    authenticate: useCallback((accessToken: string | null, user: UserResponse | null) => authenticate(accessToken, user), []),
    logout: useCallback(() => logout(), [])
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}