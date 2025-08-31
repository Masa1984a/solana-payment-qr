// src/utils/solana.ts
import { 
    Connection, 
    PublicKey, 
    Transaction, 
    SystemProgram,
    clusterApiUrl,
    LAMPORTS_PER_SOL
  } from "https://esm.sh/@solana/web3.js@1.87.6";
  
  type SolanaCluster = "devnet" | "testnet" | "mainnet-beta";

  export async function createTransferTransaction(
    senderAddress: string,
    recipientAddress: string,
    amountSOL: number,
    network: string,
  ): Promise<string> {
    const connection = new Connection(clusterApiUrl(network as SolanaCluster));
    const sender = new PublicKey(senderAddress);
    const recipient = new PublicKey(recipientAddress);
    
    const transaction = new Transaction();
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: recipient,
        lamports: Math.floor(amountSOL * LAMPORTS_PER_SOL),
      })
    );
  
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = sender;
  
    const serialized = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });
    
    return btoa(String.fromCharCode(...serialized));
  }