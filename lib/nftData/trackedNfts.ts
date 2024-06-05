import { Address } from "viem";
import { ChainId } from "@decent.xyz/box-common";

export interface ParamProps {
  contractAddress: Address,
  userAddress: Address,
  quantity: number
}

export interface ContractAddress {
  address: Address;
  chainId: ChainId;
  source: "Zora" | "Anotherblock" | "ThirdWeb" | "Decent" | "Manifold" | "Highlight" | "Nfts2Me";
  price: string;
  artist: string;
  startDate: number;
  endDate: number;
  maxTokens?: number;
  id?: number;
  token?: Address;
  pattern?: 'proxy';
  mintFee: string;
  art: string;
}

export interface MintInfoProps {
  mintMethod: string;
  params: any;
  startDate?: number;
  endDate?: number;
  maxTokens?: number;
  price: string;
  mintFee: string;
  totalPrice: string;
}

export const trackedNfts: ContractAddress[] = [
  // Richard Zheng
  { address: '0x09ABBfC872A726739F013C4D6AF656dD2d49e3D5', chainId: ChainId.BASE, startDate: 1717689600, endDate: 1717775940, price: "0.002", mintFee: '0.0008', source: 'Decent', artist: 'Richard Zheng', art: '/nfts/richard-zheng.jpg' },
  // Numo
  { address: '0xeCa5F63E4C281516444825359bF04cAC5a915880', chainId: ChainId.BASE, startDate: 1717603200, endDate: 1717689540, price: "0.001", mintFee: '0.0008', source: 'Decent', artist: 'Numo', art: '/nfts/numo.png' },
  // sian
  { address: '0xcEAd19855115531F0c19789cc783dD0c96666be6', chainId: ChainId.BASE, startDate: 1717516800, endDate: 1717603140, price: "0.0008", mintFee: '0.0008', source: 'Decent', artist: 'Sian', art: '/nfts/sian.mp4' },
  // basedeneo
  { address: '0x28C2D938C7aFAbb9D83cF0D52d936236ED17FE7b', chainId: ChainId.BASE, startDate: 1717430400, endDate: 1717516740, price: "0", mintFee: '0.0008', source: 'Decent', artist: 'basedeneo', art: '/nfts/basedeneo.png' },
  // yungwknd
  { address: '0x4B3C292592b9d2FEDa6817DB21ab99Bbec5ceb37', chainId: ChainId.BASE, startDate: 1717171200, endDate: 1717257540, price: "0", mintFee: '0.0008', source: 'Decent', artist: 'yungwknd', art: '/nfts/transitions.mp4' },
  // ArrogantKei
  { address: '0xB005eb1a7d873a1949a660e186A371970F052907', chainId: ChainId.BASE, startDate: 1717084800, endDate: 1717171140, price: "0.0027", mintFee: '0.0008', source: 'Decent', artist: 'ArrogantKei', art: '/nfts/ArrogantKei.png' },
  // Mike Elf
  { address: '0xFe1857CBd3D01849D01561DdB1Cf3CdBa93A5781', chainId: ChainId.BASE, startDate: 1716998400, endDate: 1717084740, price: "0", mintFee: '0.0008', source: 'Decent', artist: 'The Mike Elf', art: '/nfts/mike-elf.mp4' },
  // Slander
  { address: '0x6402dbE605260981fe7aF259EC7a51FA74848AF4', chainId: ChainId.BASE, startDate: 1716912000, endDate: 1716998340, price: "0", mintFee: '0.0008', source: 'Decent', artist: 'Slander', art: '/nfts/slander.png' },
  // jvmi
  { address: '0x20479B19Ca05e0b63875a65ACf24d81cd0973331', chainId: ChainId.BASE, startDate: 1716825600, endDate: 1716911940, price: "0", mintFee: '0.0008', source: 'Decent', artist: 'jvmi', art: '/nfts/jvmi.jpg' },
  // Rick Crane
  { address: '0x7756a5315346ba448698D3d593238AC4e0E9fCdB', chainId: ChainId.BASE, startDate: 1716566400, endDate: 1716652740, price: "0.002", mintFee: '0.0008', source: 'Decent', artist: 'Rick Crane', art: '/nfts/rick-crane.jpg' },
  // Amber
  { address: '0xe223dF3cF0953048eb3c575abcD81818C9ea74B8', chainId: ChainId.BASE, startDate: 1716480000, endDate: 1716566400, price: "0.0008", mintFee: '0.0008', source: 'Decent', artist: 'Amber Vittoria', art: '/nfts/amber.jpg' },
];

export const orderedNfts = (nftData?: any) => {
  let activeNfts: ContractAddress[] = [];
  let activeNftData = [];
  const currentUnixTimestamp = Math.floor(Date.now() / 1000);
  
  trackedNfts.forEach((nft: ContractAddress) => {
    if (nft.startDate < currentUnixTimestamp && nft.endDate > currentUnixTimestamp) {
      activeNfts.unshift(nft);
    } else {
      activeNfts.push(nft);
    }
  });

  if (nftData) {
    const activeNftsIndexMap = new Map<string, number>();
    activeNfts.forEach((nft, index) => {
      activeNftsIndexMap.set(nft.address.toLowerCase(), index);
    });
  
    activeNftData.length = activeNfts.length;
  
    nftData.forEach((nft: any) => {
      const address = nft.primaryContract.toLowerCase();
      const index = activeNftsIndexMap.get(address);
      if (index !== undefined) {
        activeNftData[index] = nft;
      }
    });
  
    return {
      activeNfts,
      activeNftData
    };
  } else {
    return {
      activeNfts,
      activeNftData: undefined
    }
  }
}