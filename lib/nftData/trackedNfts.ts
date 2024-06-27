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
  // by Satoshi’s Mom
  { address: '0x8cbdD0ca795A069847Dc241006997049e9362f24', chainId: ChainId.BASE, startDate: 1719504000, endDate: 1719590340, price: "0.0025", mintFee: '0.0008', source: 'Decent', artist: 'Satoshi’s Mom', art: '/nfts/chewing-gum.gif' },
  // by Mumbot
  { address: '0x6d8392343cFeAAB344e1C2daCD1A871Fff69b463', chainId: ChainId.BASE, startDate: 1719417600, endDate: 1719503940, price: "0.002", mintFee: '0.0008', source: 'Decent', artist: 'Mumbot', art: '/nfts/freshfruit.png' },
  // by ChrisCoCreated
  { address: '0x77da82374fbb6AF39009E025DF68F843654E2133', chainId: ChainId.BASE, startDate: 1719331200, endDate: 1719417540, price: "0.002", mintFee: '0.0008', source: 'Decent', artist: 'ChrisCoCreated', art: '/nfts/slow.jpg' },
  // by Jonathan Wolfe
  { address: '0xe27366c3fC8D7Cc31AB00475294D7Ed2aC9129C1', chainId: ChainId.BASE, startDate: 1719244800, endDate: 1719331140, price: "0.006", mintFee: '0.0008', source: 'Decent', artist: 'Galaktic Gang', art: '/nfts/speaceship.mp4' },
  // by Jonathan Wolfe
  { address: '0x896037d93A231273070dd5F5c9a72aba9A3Fe920', chainId: ChainId.BASE, startDate: 1718985600, endDate: 1719071999, price: "0.0025", mintFee: '0.0008', source: 'Decent', artist: 'Jonathan Wolfe', art: '/nfts/wolfelrg.png' },
  // by Sinclair
  { address: '0xB765D5C4769f6abd05f4B8948BceA4888A25ce49', chainId: ChainId.BASE, startDate: 1718899200, endDate: 1718985540, price: "0", mintFee: '0.0008', source: 'Decent', artist: 'Sinclair', art: '/nfts/sinclair.gif' },
  // by Tristan Rettich
  { address: '0x4680c6A96941A977FeAF71e503f3D0409157E02F', chainId: ChainId.BASE, startDate: 1718812800, endDate: 1718899140, price: "0.0015", mintFee: '0.0008', source: 'Decent', artist: 'Tristan Rettich', art: '/nfts/tristan-rettich.gif' },
  // by Max Jackson
  { address: '0x0E39715Ca6208EC6b5094FF9E4699A32EbAb9a3f', chainId: ChainId.BASE, startDate: 1718726400, endDate: 1718812740, price: "0.002", mintFee: '0.0008', source: 'Decent', artist: 'Max Jackson', art: '/nfts/max-jackson.png' },
  // by Kyle Patrick
  { address: '0x8c9F52691cF9F9F0C4c8ccB9b63E3a27283a8319', chainId: ChainId.BASE, startDate: 1718640000, endDate: 1718726340, price: "0", mintFee: '0.0008', source: 'Decent', artist: 'Kyle Patrick', art: '/nfts/basedworld.png' },
  // by Mentl Nomad
  { address: '0x328d0e9376D6e4207bC6A917bE2761D10FA4E115', chainId: ChainId.BASE, startDate: 1718380800, endDate: 1718467140, price: "0", mintFee: '0.0008', source: 'Decent', artist: 'Mentl Nomad', art: '/nfts/mentl-nomad.mp4' },
  // by Foodmasku
  { address: '0xB1a162386300340DA55AFa3e6Ab8bbdCEf405401', chainId: ChainId.BASE, startDate: 1718294400, endDate: 1718380740, price: "0", mintFee: '0.0008', source: 'Decent', artist: 'Foodmasku', art: '/nfts/foodmasku.jpeg' },
  // by Luciana Guerra
  { address: '0x708A6a44f56f47548c0bff16c9fe18aBa9F5338B', chainId: ChainId.BASE, startDate: 1718208000, endDate: 1718294340, price: "0.00088", mintFee: '0.0008', source: 'Decent', artist: 'Luciana Guerra', art: '/nfts/luciana-guerra.png' },
  // Trevor Traynor
  { address: '0x902e4A04583555a6F20e7Fa0a0D6470D05388Fcb', chainId: ChainId.BASE, startDate: 1718121600, endDate: 1718207940, price: "0.0008", mintFee: '0.0008', source: 'Decent', artist: 'Trevor Traynor', art: '/nfts/trevor-traynor.jpg' },
  // developer
  { address: '0x074aC088b2cF8d39141BE090DA7d91d49138628A', chainId: ChainId.BASE, startDate: 1718035200, endDate: 1718121540, price: "0", mintFee: '0.0008', source: 'Decent', artist: 'developer', art: '/nfts/developer.gif' },
  // Luca Ponsato
  { address: '0xf42cFC0521aeD33D7795a5152d487e8dD446E4F0', chainId: ChainId.BASE, startDate: 1717776000, endDate: 1717862340, price: "0.001", mintFee: '0.0008', source: 'Decent', artist: 'Luca Ponsato', art: '/nfts/lucaAscension.jpg' },
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