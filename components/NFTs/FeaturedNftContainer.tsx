import NftCard from "./NftCard";
import styles from "../../styles/nfts.module.css";
import { useState } from 'react';
import { useFeaturedNftContext } from "../../lib/contexts/FeaturedNftContext";
import { useSearchContext } from "../../lib/contexts/SearchContext";
import { useRunSearch } from "../../lib/runSearch";

const FeaturedNftContainer = ({ nftData }: any) => {
  const { middleIndex, setMiddleIndex } = useFeaturedNftContext();
  const { search } = useSearchContext();
  const [sortedNftData, setSortedNftData] = useState(nftData); 

  function handleNext() {
    setMiddleIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      const resetIndex = nextIndex >= nftData.length ? 0 : nextIndex;
      setTimeout(() => {
        document.getElementById("nft-" + resetIndex)?.scrollIntoView({ behavior: "smooth" });
      }, 0);
      return resetIndex;
    });
  }

  function handlePrev() {
    setMiddleIndex(prevIndex => {
      const nextIndex = prevIndex - 1;
      const resetIndex = nextIndex < 0 ? nftData.length - 1 : nextIndex;
      setTimeout(() => {
        document.getElementById("nft-" + resetIndex)?.scrollIntoView({ behavior: "smooth" });
      }, 0);
      return resetIndex;
    });
  }

  useRunSearch({
    nftData,
    sortedNfts: sortedNftData,
    setSortedNfts: setSortedNftData
  })

  return <>
    <div className={`${styles.featuredContainer} relative overflow-x-scroll`}>
      <div className={`${styles.emptyItem} md:w-1/4 w-1/2 hidden md:inline-block`} />
      {sortedNftData.map((collection: any, i: number) => {
        return <NftCard
          key={i}
          index={i}
          collection={collection}
          cardView={false}
        />
      })}
      <div className={`${styles.emptyItem} md:w-1/4 w-1/2 hidden md:inline-block`} />
    </div>
    <div className="flex justify-between w-full pt-4">
      <button
        className="border px-5 py-[2px] rounded-md"
        onClick={handlePrev}
      >
        ⬅
      </button>
      <button
        className="border px-5 py-[2px] rounded-md"
        onClick={handleNext}
      >
        ⮕
      </button>
    </div>
  </>
}

export default FeaturedNftContainer;