import {createContext, useContext, useState} from 'react';

export interface UserInterfaceType {
  email: string;
  id: string;
  name: string;
  avatar_url: string;
}

export const InitialUserState = {
  email: '',
  id: '',
  name: '',
  avatar_url: '',
};

const UserContext = createContext(InitialUserState);

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = (props: any) => {
  const [userState, setUserState] = useState<UserInterfaceType>(InitialUserState);

  const SetUser = (userCredential: any) => {
    setUserState({...userCredential});
  };

  const ResetUser = () => {
    setUserState(InitialUserState);
  };

  const value = {...userState, SetUser, ResetUser};
  return <UserContext.Provider value={value} {...props} />;
};
