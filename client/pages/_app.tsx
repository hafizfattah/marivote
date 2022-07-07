import '../styles/globals.scss';
import AuthStateChangeProvider from '../context/auth';
import {UserProvider} from '../context/user';
import Layout from '../components/layout';

function MyApp({Component, pageProps}: any) {
  return (
    <UserProvider>
      <AuthStateChangeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthStateChangeProvider>
    </UserProvider>
  );
}

export default MyApp;
