import { useCallback, createContext, ReactNode } from "react"
import useLocalStorage from "../hooks/useLocalStorage"
import { isTokenExpired } from "@/utils/jwtUtils";
import { UserResponse } from "~/constants/types";
import {OrganizationResponse} from "@/constants/types";

type UserContextType = {
  user: UserResponse | null;
  organization: OrganizationResponse | null;
  accessToken: string | null;
  authenticate: (accessToken: string | null, user: UserResponse | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  organization: null,
  accessToken: null,
  authenticate: () => { },
  logout: () => { },
  isAuthenticated: () => false
})

type UserContextProviderType = {
  children: ReactNode;
  user: UserResponse | null;
  organization: OrganizationResponse | null;
}

export const UserContextProvider = ({ children, user, organization }: UserContextProviderType) => {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>("ACCESS_TOKEN", null)

  const authenticate = (_accessToken: string | null) => {
    setAccessToken(_accessToken);
    console.log("userContext authenticate", accessToken, user)
  }

  const logout = () => {
    setAccessToken(null);
    console.log("userContext logout")
  }

  const isAuthenticated = (): boolean => {
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    return accessToken != null && accessToken !== "" && !isTokenExpired(accessToken)
  }

  const contextValue = {
    user: user,
    organization: organization,
    accessToken: accessToken,
    isAuthenticated: useCallback(() => isAuthenticated(), [accessToken]),
    authenticate: useCallback((accessToken: string | null) => authenticate(accessToken), []),
    logout: useCallback(() => logout(), [])
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}