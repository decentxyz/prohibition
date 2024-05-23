import { getFrameMetadata } from 'frog/next';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  console.log("Test generating metadata");
  const frameTags = await getFrameMetadata(
    `${process.env.FRAME_URL || 'http://daily.prohibition.art/'}/api/frames`,
  )
  return {
    other: frameTags,
  }
}

export default function Home() {
  return (
    <>
      <h1>Build Decent</h1>
    </>
  )
}