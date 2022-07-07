import {createContext, SetStateAction, useContext, useState} from 'react';

export const InitialUserState = {
  email: null,
  id: null,
  name: null,
  avatar_url: null,
};

const UserContext = createContext(InitialUserState);

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = (props) => {
  const [userState, setUserState] = useState(InitialUserState);

  const SetUser = (userCredential) => {
    setUserState({...userCredential});
  };

  const ResetUser = () => {
    setUserState(InitialUserState);
  };

  const value = {...userState, SetUser, ResetUser};
  return <UserContext.Provider value={value} {...props} />;
};
