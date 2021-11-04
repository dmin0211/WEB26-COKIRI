import type { ReactElement } from 'react';
import Head from 'next/head';

function Home(): ReactElement {
  return (
    <div>
      <Head>
        <title>COCOO</title>
        <meta
          name='description'
          content='일상을 쉽게 공유하지 못하는 개발자를 위한 SNS.몇번의 클릭으로 다른 개발자의 흔적을 볼 수 있다.그리고 코쿠(COCOO)는 개발자의 흩어진 노력을 모아준다.'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>Home/</main>

      <footer />
    </div>
  );
}

export default Home;