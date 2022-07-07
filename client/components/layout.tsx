import Header from 'components/header';
import {useRouter} from 'next/router';

export default function DefaultLayout({children}: any) {
  const router = useRouter();
  return (
    <div>
      {router.route !== '/' && <Header />}

      <main className="main">{children}</main>
    </div>
  );
}
