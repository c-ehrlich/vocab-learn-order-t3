import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const words = trpc.proxy.vocab.learnOrder.useQuery({
    words: ['食べる', '相談', '食事', '食券'],
    weights: {
      animeJDrama: 1,
      bccwj: 1,
      innocent: 1,
      kokugojiten: 1,
      narou: 1,
      netflix: 1,
      novels: 1,
      vn: 1,
      wikipedia: 1,
    },
  });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {isSearching ? <div>searching</div> : <div>searchfield</div>}
    </>
  );
};

export default Home;
