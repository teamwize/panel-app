import { useCallback, createContext, ReactNode, useState } from "react"
import useLocalStorage from "../hooks/useLocalStorage"
import { UserResponse } from "@/constants/types/userTypes";
import {OrganizationResponse} from "@/constants/types/organizationTypes";

type UserContextType = {
  user: UserResponse | null;
  organization: OrganizationResponse | null;
  accessToken: string | null;
  authenticate: (accessToken: string | null, user: UserResponse | null) => void;
  signout: () => void;
  isAuthenticated: () => boolean;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  organization: null,
  accessToken: null,
  authenticate: () => { },
  signout: () => { },
  isAuthenticated: () => false
})

type UserContextProviderType = {
  children: ReactNode;
}

export const UserContextProvider = ({ children}: UserContextProviderType) => {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>("ACCESS_TOKEN", null)
  const [user, setUser] = useState<UserResponse | null>(null);
  const [organization, setOrganization] = useState<OrganizationResponse | null>(null);

  const authenticate = (_accessToken: string | null) => {
    setAccessToken(_accessToken);
    setUser(user);
    setOrganization(organization);
    console.log("userContext authenticate", accessToken, user)
  }

  const signout = () => {
    setAccessToken(null);
    setUser(null);
    setOrganization(null);
    console.log("userContext signout")
  }

  const isAuthenticated = (): boolean => {
    return accessToken != null && accessToken !== "";
  }

  const contextValue = {
    user: user,
    organization: organization,
    accessToken: accessToken,
    isAuthenticated: useCallback(() => isAuthenticated(), [accessToken]),
    authenticate: useCallback((accessToken: string | null) => authenticate(accessToken), []),
    signout: useCallback(() => signout(), [])
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}