import {
  bigintSerializer,
  bigintDeserializer,
  ActionType,
  BoxActionRequest,
  ChainId,
  EvmAddress
} from '@decent.xyz/box-common';
// import { sendTransaction } from '@wagmi/core';
import { createPublicClient, http, parseAbi, Chain } from 'viem'
import { base, polygon } from 'viem/chains'

/*
import {
  baseClient,
  erc20Abi,
  getUserBalance,
  getTokenWithMaxBalance,
  getTransactionStatus,
  getTransactionData,
} from '../decentUtils';
*/

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import * as dotenv from 'dotenv';
dotenv.config();

type State = {
  txHash: string | undefined,
  srcChain: number,
}

const chain = base;
const zeroAddress = '0x0000000000000000000000000000000000000000';
/****************************
 *
 *  Constants
 *
 ****************************/

const debug = true; // enable (true) or disable (false) debug logging

/****************************
 *
 *  Decent Helper Functions
 *
 ****************************/

export const decentRequestOptions = {
    method: 'GET',
    headers: { 'x-api-key': process.env.DECENT_API_KEY!! },
};

export async function getUserBalance(chainId: number, account: string) {
    const response = await fetch(
        `https://box-v2.api.decent.xyz/api/getTokens?address=${account}&chainId=${chainId}`,
        decentRequestOptions,
    );
    console.log('response', response);
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Expected an array of tokens');
    }

    return data;
}

export async function getTokenWithMaxBalance(chainId: number, tokens: [token], useNative?: boolean, usdAmount: number | undefined = undefined) {
    let maxBalance = 0; // tracker of current max token balance in USD
    let sourceToken = zeroAddress; // sourceToken to be used for payment
    let native = false; // whether or not native balance is enough

    await Promise.all(tokens.map(async (token: token) => {
        if (['USDC', 'ETH', 'DEGEN'].includes(token.symbol)) {
            const tokenQuery = new URLSearchParams({
                chainId: chainId.toString(),
                tokenAddress: token.address,
            });
            const response = await fetch(`https://api.decentscan.xyz/getTokenPrice?${tokenQuery}`, decentRequestOptions);
            const data = await response.json();
            if (debug) { console.log(token.name, 'data = ', data); }
            const balance = token.balanceFloat * data.usdPrice;
            if (debug) { console.log('balance = ', token.balanceFloat, '*', data.usdPrice, 'which js says is:', balance) };

            if (useNative && usdAmount) {
                if (token.symbol === 'ETH' && balance > usdAmount) { native = true; if (debug) console.log('Using native gas token.') }
            }

            if (balance > maxBalance) {
                console.log(maxBalance, 'is less than', balance, 'so setting sourceToken to', token.address)
                sourceToken = token.address;
                maxBalance = balance;
            }
        }
    }));
    if (useNative && native) {
        sourceToken = zeroAddress;
    }
    if (debug) { console.log('Source Token:', sourceToken); }
    return sourceToken;
}

export async function getTransactionData(txConfig: BoxActionRequest) {
    const url = new URL('https://box-v2.api.decent.xyz/api/getBoxAction');
    url.searchParams.set('arguments', JSON.stringify(txConfig, bigintSerializer));

    const response = await fetch(url.toString(), decentRequestOptions);
    if (debug) { console.log('decent response', response) };
    const textResponse = await response.text();
    const { tx, tokenPayment } = await JSON.parse(textResponse, bigintDeserializer);

    if (debug) { console.log({ tx, tokenPayment }); }
    return { tx, tokenPayment };
}

export async function getTransactionStatus(chainId: number, txHash: string) {
    const queryParams = new URLSearchParams({
        chainId: (chainId).toString(),
        txHash: txHash,
    });

    try {
        const response = await fetch(`https://api.decentscan.xyz/getStatus?${queryParams}`, decentRequestOptions);
        const data = await response.json();

        if (debug) { console.log('Transaction status:', data.status, ' Destionation chain TX hash: ', data.transaction.dstTx.fast.transactionHash) };

        return { status: data.status, transactionHash: data.transaction?.dstTx?.fast?.transactionHash };
    } catch (error) {
        console.error('Error fetching transaction status:', error);
        return { status: null, transactionHash: null };
    }
}

/****************************
 *
 *  Types
 *
 ****************************/

export type token = {
    name: string,
    symbol: string,
    decimals: number,
    address: string,
    isNative: boolean,
    logo: string,
    chainId: number,
    balanceFloat: number,
    balance: string
}

/****************************
 *
 *  Viem Clients
 *
 ****************************/

export const baseClient = createPublicClient({
    chain: base as Chain,
    transport: http(process.env.BASE_RPC_URL || undefined)
})

/****************************
 *
 *  ABI
 *
 ****************************/

export const erc20Abi = parseAbi([
    // ERC20 ABI functions
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address) view returns (uint256)',
    'function transfer(address, uint256) returns (bool)',
    'function allowance(address, address) view returns (uint256)',
    'function approve(address, uint256) returns (bool)',
    'function transferFrom(address, address, uint256) returns (bool)',
    // ERC20 Events
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'event Approval(address indexed owner, address indexed spender, uint256 value)'
])


export const app = new Frog<{ State: State }>({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY!! }),
  initialState: {
    txHash: undefined,
    srcChain: -1,
  },
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', async (c) => {
  return c.res({
    // adapt the image url to your liking. add an image in the /public folder
    image: `${process.env.FRAME_URL || 'http://localhost:5173'}/nfts/nft.png`,
    imageAspectRatio: '1:1',
    intents: [
      <Button.Transaction key='success' target="/tx" action="/tx-success">Mint Now</Button.Transaction>,
      //<Button.Transaction target="/approve" action="/tx">Approve</Button.Transaction>,
    ],
  })
})

app.transaction('/approve', async (c) => {
  const account = c.address;
  const tokens = await getUserBalance(chain.id, account);
  // @ts-ignore
  const sourceToken = await getTokenWithMaxBalance(chain.id, tokens);

  console.log('tokens etc', tokens, sourceToken);

  const txConfig: BoxActionRequest = {
    sender: account!,
    srcChainId: chain?.id as ChainId,
    dstChainId: ChainId.BASE,
    srcToken: sourceToken,
    dstToken: '0x0000000000000000000000000000000000000000',
    slippage: 1,
    actionType: ActionType.EvmFunction,
    actionConfig: {
      contractAddress: process.env.CONTRACT_ADDRESS as string,
      chainId: ChainId.BASE,
      signature: "function mint(address to,uint256 numberOfTokens) payable",
      args: [account, 1],
      cost: {
        isNative: true,
        amount: BigInt(process.env.NFT_PRICE_ETH as string),
        tokenAddress: '0x0000000000000000000000000000000000000000',
      },
    }
  }
  const { tx, tokenPayment } = await getTransactionData(txConfig);
  if (sourceToken == zeroAddress) {
    return c.error({ message: 'You can mint right away. Press Execute!' });
  }

  const allowance = await baseClient.readContract({
    address: sourceToken as EvmAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [
      account as EvmAddress,
      tx.to as EvmAddress,
    ]
  });

  if (allowance >= tokenPayment.amount) {
    return c.error({ message: 'You can execute right away. Press Execute!' });
  }

  // requires approval
  return c.contract({
    abi: erc20Abi,
    chainId: `eip155:${chain.id}`,
    functionName: 'approve',
    to: sourceToken as EvmAddress,
    args: [
      tx.to,
      tokenPayment.amount
    ]
  })
});

app.transaction('/tx', async (c) => {
  const account = c.address; // uses wallet connected to displayed Frame
  console.log('info', account, chain.id);
  const tokens = await getUserBalance(chain.id, account);
  //@ts-ignore
  const sourceToken = await getTokenWithMaxBalance(chain.id, tokens, true, 25);

  const txConfig: BoxActionRequest = {
    sender: account!,
    srcChainId: chain?.id as ChainId,
    dstChainId: ChainId.BASE,
    srcToken: sourceToken,
    dstToken: '0x0000000000000000000000000000000000000000',
    slippage: 1,
    actionType: ActionType.EvmFunction,
    actionConfig: {
      contractAddress: process.env.CONTRACT_ADDRESS as string,
      chainId: ChainId.BASE,
      signature: "function mint(address to,uint256 numberOfTokens) payable",
      args: [account, 1],
      cost: {
        isNative: true,
        amount: BigInt(process.env.NFT_PRICE_ETH as string),
        tokenAddress: '0x0000000000000000000000000000000000000000',
      },
    }
  }

  const { tx, tokenPayment } = await getTransactionData(txConfig);
  if (sourceToken !== zeroAddress) {
    const allowance = await baseClient.readContract({
      address: sourceToken as EvmAddress,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [
        account as EvmAddress,
        tx.to as EvmAddress,
      ]
    });

    if (allowance < tokenPayment.amount) {
      // requires approval
      return c.error({ message: 'Requires approval' });
    }
  }

  return c.res({
    chainId: `eip155:${base.id}`,
    method: "eth_sendTransaction",
    params: {
      to: tx.to,
      data: tx.data,
      value: tx.value.toString(),
    },
  },)
})

app.frame('/tx-success', async (c) => {
  let { transactionId, deriveState } = c;
  let state: State;
  state = deriveState(previousState => {
    previousState.txHash = transactionId;
    previousState.srcChain = chain.id;
  })

  console.log('Source Chain TX Hash:', transactionId, 'State: ', state)

  const { status, transactionHash } = await getTransactionStatus(state.srcChain, state.txHash!!);

  if (status === 'Executed') {
    console.log('Transaction has been executed successfully.');

    try {
        return c.res({
        image: process.env.FRAME_URL + "/frame/success.png",
        imageAspectRatio: '1:1',
        intents: [
          <Button.Link key='success' href={process.env.AFTER_MINT_URL as string}> {process.env.AFTER_MINT_TEXT as string}</Button.Link>,
        ],
      })

    } catch (err) {
      console.error('Error in our custom logic:', err);
    }
  } else if (status === 'Failed') {
    console.log('Transaction has failed.');

    // return a new frame where image shows failed
    return c.res({
      image: <div style={{ fontSize: 12 }}>Transaction failed, try again!</div>,
      imageAspectRatio: '1:1',
      intents: [
        <Button.Transaction key='failed' target="/tx" action="/tx-success">Mint Now</Button.Transaction>,
      ],
    })
  }

  return c.res({
    image: process.env.FRAME_URL + "/frame/waiting.png", // replace with your nice waiting screen image
    imageAspectRatio: '1:1',
    intents: [
      <Button key='waiting' action='/end'>Processing... Check Status</Button>,
    ],
  })
})

app.frame('/end', async (c) => {
  let { previousState } = c;
  console.log('State: ', previousState)
  const { status, transactionHash } = await getTransactionStatus(previousState.srcChain, previousState.txHash!!);

  if (status === 'Executed') {
    console.log('Transaction has been executed successfully.');

    try {
        // do your custom logic on successful transaction here

        return c.res({
        image: process.env.FRAME_URL + "/frame/end.png",
        imageAspectRatio: '1:1',
        intents: [
          <Button.Link key='end' href={process.env.AFTER_MINT_URL as string}> {process.env.AFTER_MINT_TEXT as string}</Button.Link>,
        ],
      })

    } catch (err) {
      console.error('Error in our custom logic:', err);
    }
  } else if (status === 'Failed') {
    console.log('Transaction has failed.');

    // return a new frame where image shows failed
    return c.res({
      image: <div style={{ fontSize: 12 }}>Transaction failed, try again!</div>,
      imageAspectRatio: '1:1',
      intents: [
        <Button.Transaction key='failed-2' target="/tx" action="/tx-success">Mint Now</Button.Transaction>,
      ],
    })
  }

  return c.res({
    image: process.env.FRAME_URL + "/frame/waiting.png", // replace with your nice waiting screen image
    imageAspectRatio: '1:1',
    intents: [
      <Button key='processing' action='/end'>Processing... Check Status</Button>,
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)