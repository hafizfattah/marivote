import Button from 'components/button';
import Image from 'next/image';
import team from '../public/team.png';
import {useUser} from '../context/user';
import {useEffect} from 'react';
import {useRouter} from 'next/router';
import supabase from '../utils/supabase';

const Home = () => {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (user.id) {
      const redirectUrl = localStorage.getItem('referer') || '/room';
      router.push(redirectUrl);
    }
  }, [user, router]);

  useEffect(() => {
    if (router.query.referer) localStorage.setItem('referer', router.query.referer as string);
  }, [router]);

  useEffect(() => {
    router.prefetch('/room');
  }, [router]);

  const login = async () => {
    await supabase.auth.signIn({provider: 'google'});
  };

  return (
    <div className="bg-hfg-green min-h-screen flex flex-col justify-center">
      <div className="container">
        <h1 className="font-black md:text-[5vw] text-[12vw] leading-none text-center text-hfg-yellow uppercase text-shadowed">MARIVOTE</h1>
        <Image alt="team" src={team} width="900" height="500" />
        <div className="rounded-xl border-hfg-black bg-white border-4 p-6 flex flex-col items-center mt-[-12px] relative w-[90%] mx-auto">
          <h2 className="font-black text-4xl">Login</h2>
          <p className="mt-6">
            In every life there comes a point when you have to make a decision, so please decide are you gonna login or not?
          </p>
          <div className="flex flex-col md:flex-row justify-between w-full">
            <Button className="mt-6 md:w-[calc(50%-0.5rem)]" onClick={() => login()}>
              Email
            </Button>
            <Button variant="secondary" className="mt-4 md:mt-6 md:w-[calc(50%-0.5rem)]" onClick={() => router.push('/room')}>
              Skip
            </Button>
          </div>
          <p className="mt-6 text-xs">* If you skip login, your vote will be removed in the next 24 hours</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
