import { getFrameMetadata } from 'frog/next';
import type { Metadata } from 'next';
import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import styles from '../../styles/frame.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.FRAME_URL || 'http://localhost:3000/'}/api/genFrame`,
  )

  console.log("HERE: ", frameTags)
  return {
    other: frameTags,
  }
}

export default function Home(props: any) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.href = `https://daily.prohibition.art/mint/${props.chainId}/${props.address}`;
    }
  }, []);

  return (
    <>
      <h1>Prohibition Dailys</h1>
      <p>by decent.xyz</p>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { address, chainId } = context.query;
  return {
    props: {
      address,
      chainId
    }
  }
};
