/**
 * IMAGES YOU WILL NEED
    * public/nft.png
    * public/waiting.png
    * public/end.png
    * public/success.png
 */

import {
  ActionType,
  BoxActionRequest,
  ChainId,
  EvmAddress
} from '@decent.xyz/box-common';
import {
  baseClient,
  erc20Abi,
  getUserBalance,
  getTokenWithMaxBalance,
  getTransactionStatus,
  getTransactionData,
} from './decentUtils';
import { parseUnits } from 'viem';
import { base } from 'viem/chains';
import { Button, Frog } from 'frog';
import { neynar } from 'frog/hubs';
import { devtools } from 'frog/dev';
import { handle } from 'frog/next';
import { serveStatic } from 'frog/serve-static';
import * as dotenv from 'dotenv';
dotenv.config();

type State = {
  txHash: string | undefined,
  srcChain: number,
}

const chain = base;
const zeroAddress = '0x0000000000000000000000000000000000000000';

const app = new Frog<{ State: State }>({
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
  console.log("HERE IN FRAME...")
  return c.res({
    // adapt the image url to your liking. add an image in the /public folder
    image: `${process.env.FRAME_URL || 'http://localhost:3000/'}prohibition-full.png`,
    imageAspectRatio: '1:1',
    intents: [
      <Button.Transaction key={'mint now'} target="/tx" action="/tx-success">Mint Now</Button.Transaction>,
      <Button.Transaction key={'approve token'} target="/approve" action="/">Approve</Button.Transaction>,
    ],
  })
})

app.transaction('/approve', async (c) => {
  const account = c.address;

  const tokens = await getUserBalance(chain.id, account);
  const sourceToken = await getTokenWithMaxBalance(chain.id, tokens);

  const txConfig: BoxActionRequest = {
    sender: account!,
    srcChainId: chain?.id as ChainId,
    dstChainId: ChainId.BASE,
    srcToken: sourceToken,
    dstToken: '0x0000000000000000000000000000000000000000',
    slippage: 1,
    actionType: ActionType.EvmFunction,
    actionConfig: {
      contractAddress: process.env.CONTRACT_ADDRESS,
      chainId: ChainId.BASE,
      signature: "function mint(address to,uint256 numberOfTokens) payable",
      args: [account, 1n],
      cost: {
        isNative: true,
        amount: parseUnits(process.env.NFT_PRICE_ETH, 18),
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
  const tokens = await getUserBalance(chain.id, account);
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
      contractAddress: process.env.CONTRACT_ADDRESS,
      chainId: ChainId.BASE,
      signature: "function mintTokens(address to, uint256 numberOfTokens)",
      args: [account, 1n],
      cost: {
        isNative: true,
        amount: parseUnits(process.env.NFT_PRICE_ETH, 18),
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
        image: process.env.FRAME_URL + "/prohibition-full.png",
        imageAspectRatio: '1:1',
        intents: [
          <Button.Link key={'after mint'} href={process.env.AFTER_MINT_URL}> {process.env.AFTER_MINT_TEXT}</Button.Link>,
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
        <Button.Transaction key={'mint now'} target="/tx" action="/tx-success">Mint Now</Button.Transaction>,
      ],
    })
  }

  return c.res({
    image: process.env.FRAME_URL + "/prohibition-full.png", // replace with your nice waiting screen image
    imageAspectRatio: '1:1',
    intents: [
      <Button key={'processing'} action='/end'>Processing... Check Status</Button>,
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
        image: process.env.FRAME_URL + "/prohibition-full.png",
        imageAspectRatio: '1:1',
        intents: [
          <Button.Link key='success link' href={process.env.AFTER_MINT_URL}> {process.env.AFTER_MINT_TEXT}</Button.Link>,
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
        <Button.Transaction key={'mint'} target="/tx" action="/tx-success">Mint Now</Button.Transaction>,
      ],
    })
  }

  return c.res({
    image: process.env.FRAME_URL + "/prohibition-full.png", // replace with your nice waiting screen image
    imageAspectRatio: '1:1',
    intents: [
      <Button key={'loading'} action='/end'>Processing... Check Status</Button>,
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)