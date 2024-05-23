import { readContract } from "@wagmi/core";
import { EditionsAbi } from "../../utils/dcntEditionsAbi";
import { wagmiConfig } from "../wagmiConfig";
import { Address } from "viem";


export async function getContractInfo({
  address,
  chainId,
}: {
  address: Address,
  chainId: number
}) {
  async function read({ functionName }:{ functionName: string }){
    return await readContract(wagmiConfig, {
      abi: EditionsAbi,
      address,
      functionName,
      chainId
    });
  }

  const [saleStart, saleEnd, name, symbol, tokenPrice, mintFee] = await Promise.all(
    [
      read({ functionName: 'saleStart' }),
      read({ functionName: 'saleEnd' }),
      read({ functionName: 'name' }),
      read({ functionName: 'symbol' }),
      read({ functionName: 'tokenPrice' }),
      read({ functionName: 'mintFee' }),
    ]
  );

  console.log("TEST HERE: ", saleStart)

  return {
    saleStart,
    saleEnd,
    name,
    symbol,
    tokenPrice,
    mintFee
  }
}