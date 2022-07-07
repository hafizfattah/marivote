/* eslint-disable react/display-name */
import {useRouter} from 'next/router';
import {useUser} from '../context/user';

const protectedRoute = (Pages: any) => {
  return (props: any) => {
    const router = useRouter();
    const user = useUser();
    const {id} = user;
    if (!id) {
      console.log(router);
      router.push({
        pathname: '/',
        query: {
          referer: router.asPath,
        },
      });
      return <></>;
    }

    return <Pages {...props} />;
  };
};

export default protectedRoute;
