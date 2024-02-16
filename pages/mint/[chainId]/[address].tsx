import { GetServerSideProps, NextPage } from 'next';
import { getContractData } from '../../../lib/nftData/getContractData';
import MintNavbar from '../../../components/Navbars/MintNavbar';
import styles from "../../../styles/Home.module.css";
import Image from 'next/image';
import Link from 'next/link';
import MintFooter from '../../../components/Footers/MintFooter';
import { getMintInfo, MintInfoProps } from "../../../lib/nftData/getMintInfo";
import { useAccount, useNetwork } from "wagmi";
import { TheBox } from "@decent.xyz/the-box";
import { ActionType, ChainId } from '@decent.xyz/box-common';
import { parseUnits } from "viem";
import { EtherscanScan } from "../../../lib/utils/logos";
import { useState, useEffect } from 'react';
import { convertTimestamp } from '../../../lib/utils/convertTimestamp';
import NumberTicker from '../../../components/NumberTicker';
import { VideoDict } from '../../../lib/utils/minting/trackedNfts';
import { getBlockscanner } from '../../../lib/utils/blockscanners';
import MintButton from '../../../components/MintButton';

const Mint: NextPage = (props: any) => {
  const {
    query: { address },
    contractData
  } = props;
  const { address: account } = useAccount();
  const [activeTab, setActiveTab] = useState('Purchase');
  const [mintInfo, setMintInfo] = useState<MintInfoProps>();
  const [quantity, setQuantity] = useState(1);
  const [soldOut, setSoldOut] = useState(false);
  const { chain } = useNetwork();

  useEffect(() => {
    if (account && window && Date.now() / 1000 < mintInfo?.endDate!) {
      window.Atlas.call("identify", {
        userId: account,
       })
    }
  }, [account, mintInfo?.endDate]);

  useEffect(() => {
    async function fetchMintInfo() {
      const data = getMintInfo(
        contractData[0].primaryContract.toLowerCase(),
        quantity,
        account,
        '0.00044'
      );
      setMintInfo(data);
    }
  
    fetchMintInfo();
  }, [account, contractData, quantity]);

  useEffect(() => {
    if (Date.now() / 1000 > mintInfo?.endDate! && parseInt(contractData[0].onSaleCount) === 0) {
      setSoldOut(true);
    }
  }, [contractData, mintInfo?.endDate]);

  const blockscanner = getBlockscanner(contractData[0].chainId);

  return (
    <>
    <MintNavbar address={address} partner={contractData[0].symbol} />
    <div className={`${styles.main} px-[24px] py-[12px] relative`}>
      <div className='flex md:flex-wrap flex-wrap-reverse md:gap-0 gap-12 md:mt-0 mt-40 w-full relative'>
        <div className='md:w-1/2 w-full h-full pr-8 relative'>
          <p className="font-thin">
            <span className={`${
              contractData[0].name.length > 27 ? 'text-5xl' : 'text-7xl'
            } overflow-hidden`}>
              {contractData[0].name === 'Human' ? 'RetroPGF' : contractData[0].name}
            </span>
            {soldOut && <p className='uppercase text-red-500 text-xl pt-4'>sold out</p>}
          </p>
          <div className='pt-10 mb-2 md:w-[500px] border-b border-black flex justify-center'>
            <div className='pb-2 flex text-xl'>
              <button onClick={() => setActiveTab('Purchase')} className={`${activeTab !== 'Purchase' && 'text-gray-500 font-thin'} pr-16 border-r border-black hover:text-opacity-80`}>Purchase</button>
              <button onClick={() => setActiveTab('Details')} className={`${activeTab !== 'Details' && 'text-gray-500 font-thin'} pl-16 hover:text-opacity-80`}>Details</button>
            </div>
          </div>
          <div>
            {activeTab === 'Purchase' ? <>
              <TheBox
                className="text-xs md:max-w-[500px] bg-white"
                paymentButtonText="Pay now"
                //todo: add avax 
                chains={[ChainId.ARBITRUM, ChainId.OPTIMISM, ChainId.BASE, ChainId.ETHEREUM, ChainId.POLYGON]}
                actionType={ActionType.NftPreferMint}
                actionConfig={{
                  contractAddress: contractData[0].primaryContract,
                  chainId: contractData[0].chainId,
                  signature: mintInfo?.mintMethod,
                  args: mintInfo?.params,
                  cost: {
                    isNative: true,
                    amount: parseUnits(mintInfo?.price || '0.00', 18),
                  },
                  supplyConfig: {
                    sellOutDate: mintInfo?.endDate,
                    maxCap: mintInfo?.maxTokens
                  },
                }}
                apiKey={process.env.NEXT_PUBLIC_DECENT_API_KEY as string}
              />
              <MintButton 
                account={account!}
                mintConfig={{
                  sender: account!,
                  srcChainId: chain?.id as ChainId,
                  dstChainId: contractData[0].chainId as ChainId,
                  slippage: 1,
                  // srcToken: TO UPDATE WITH. BALANCE SELECTOR
                  actionType: ActionType.NftPreferMint,
                  actionConfig: {
                    contractAddress: contractData[0].primaryContract,
                    chainId: contractData[0].chainId,
                    signature: mintInfo?.mintMethod,
                    args: mintInfo?.params,
                    cost: {
                      isNative: true,
                      amount: parseUnits(mintInfo?.price || '0.00', 18),
                    },
                    supplyConfig: {
                      sellOutDate: mintInfo?.endDate,
                      maxCap: mintInfo?.maxTokens
                    },
                  }
                }}/>
              <div className="px-4 max-w-[500px] relative">
                <NumberTicker endDate={mintInfo?.endDate} maxTokens={mintInfo?.maxTokens} tokenCount={contractData[0].tokenCount} quantity={quantity} setQuantity={setQuantity} />
                <div className='pt-6 pl-4'>
                  <a target='_blank' href={`https://checkout.decent.xyz/?app=nft&chain=${contractData[0].chainId}&address=${contractData[0].primaryContract}%3A0`}>
                    <p className='font-thin text-xs hover:opacity-80 hover:text-primary'>{'∟'} Buy with fiat</p>
                  </a>
                </div>
              </div>
            </> : <>
              <div className='flex items-center md:w-[500px] justify-between flex-wrap gap-2 text-sm font-thin py-4'>
                <p>Mint start: {convertTimestamp(mintInfo?.startDate)}</p>
                <p>Mint end: {convertTimestamp(mintInfo?.endDate) || 'Open'}</p>
                <p>Max tokens: {mintInfo?.maxTokens || 'Open'}</p>
                <Link target="_blank" className='flex gap-2' href={`https://${blockscanner.url}/address/${contractData[0].primaryContract || ''}`}>{EtherscanScan(18, 20)} <span className='underline'> View on {blockscanner.name}</span></Link> 
              </div>
              <p className='mt-8 md:w-[500px] overflow-y-auto max-h-[200px]'>{contractData[0].description}</p>
            </>
            }
          </div>
        </div>

        <div className='md:w-1/2 w-full flex justify-center max-h-[500px] relative'>
          {VideoDict[contractData[0].symbol as keyof typeof VideoDict] ? 
            <video src={VideoDict[contractData[0].symbol as keyof typeof VideoDict]} autoPlay loop muted className='rounded-md' />
            : <Image src={contractData[0].image} height={500} width={500} alt="nft image" className='rounded-md' />
          }
        </div>
      </div>
      <div className='sm:inline-block sm:w-full sm:my-16 hidden md:hidden'></div>
        <MintFooter contractData={contractData} mintPrice={mintInfo?.price} />
    </div>
    </>
  )
}

export default Mint;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { address, chainId } = context.query
  let nftData: any;

  if (address) {
    nftData = await getContractData([address], chainId)
  };

  return {
    props: {
      contractData: nftData || null,
      query: context.query,
    }
  }
};