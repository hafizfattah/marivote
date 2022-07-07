/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import {LogOut, Plus} from 'react-feather';
import {useUser} from '../context/user';
import supabase from '../utils/supabase';

import Button from './button';
import {useEffect, useState} from 'react';

const Header = () => {
  const user = useUser();
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  function SignOut() {
    return supabase.auth.signOut();
  }
  return (
    <header>
      <div className="container py-4">
        <div className="flex flex-row justify-between items-center">
          <h1 className="font-black text-3xl leading-none text-center text-hfg-orange uppercase text-shadowed--thin">
            <Link href="/">Marivote</Link>
          </h1>
          <div className="flex items-center">
            <div className="flex items-center">
              <img
                src={currentUser.avatar_url}
                alt="Picture of the author"
                width="50"
                height="50"
                referrerPolicy="no-referrer"
                className="rounded-full mr-2"
              />
              <span className="capitalize">{currentUser.name}</span>
            </div>
            <Button className="!border-none !shadow-none ml-4" variant="black" size="small" onClick={() => SignOut()}>
              <LogOut className="w-[16px] h-[16px]" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
