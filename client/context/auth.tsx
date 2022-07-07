import {useEffect, useState} from 'react';
import supabase from '../utils/supabase';
import {InitialUserState, useUser} from './user';

const AuthStateChangeProvider = ({children}: any) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const user = useUser();
  const {SetUser} = user;

  const InitiateSession = () => {
    const supabaseSession = supabase.auth.session();
    const data = supabaseSession?.user;
    if (supabaseSession?.user) {
      SetUser({email: data?.email, id: data?.id, name: data?.user_metadata.full_name, avatar_url: data?.user_metadata.avatar_url});
      console.log('InitiateSession: User is authenticated');
    } else {
      console.log('InitiateSession: User is not authenticated');
    }
    setLoading(false);
  };

  const InitiateAuthStateChange = () => {
    supabase.auth.onAuthStateChange((_event, session) => {
      const data = session?.user;
      if (data) {
        console.log('User is authenticated');
        SetUser({email: data?.email, id: data.id, name: data?.user_metadata.full_name, avatar_url: data?.user_metadata.avatar_url});
      } else {
        SetUser(InitialUserState);
        console.log('User is not authenticated');
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    InitiateSession();
  }, []);

  useEffect(() => {
    InitiateAuthStateChange();
  }, []);

  if (isLoading) {
    return <div>loading</div>;
  }

  return children;
};

export default AuthStateChangeProvider;
