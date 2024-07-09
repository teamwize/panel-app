import { useCallback, createContext, ReactNode } from "react"
import useLocalStorage from "../hooks/useLocalStorage"
import { isTokenExpired } from "../utils/jwtUtils";
import { User } from "~/constants/types";

type UserContextType = {
  user: User | null;
  accessToken: string | null;
  authenticate: (accessToken: string | null, user: User | null) => void;
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
  const [user, setUser] = useLocalStorage<User>({key: "USER", initialValue: null})
  const [accessToken, setAccessToken] = useLocalStorage<string>({key: "ACCESS_TOKEN", initialValue: null})

  const authenticate = (accessToken: string | null, user: User | null) => {
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
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    return accessToken != null && accessToken !== "" && !isTokenExpired(accessToken)
  }

  const contextValue: UserContextType = {
    user: user as User,
    accessToken: accessToken as string,
    isAuthenticated: useCallback(() => isAuthenticated(), [accessToken]),
    authenticate: useCallback((accessToken: string | null, user: User | null) => authenticate(accessToken, user), []),
    logout: useCallback(() => logout(), [])
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}