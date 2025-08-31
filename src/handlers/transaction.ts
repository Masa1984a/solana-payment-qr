// src/handlers/transaction.ts
import { createTransferTransaction } from "../utils/solana.ts";

export async function handleTransaction(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/");
  const recipientWallet = pathParts[3];
  const amount = pathParts[4];
  const network = url.searchParams.get("network") || "mainnet-beta";
  
  try {
    const body = await req.json();
    const { account } = body;
    
    if (!account) {
      throw new Error("Account address is required");
    }

    const base64Transaction = await createTransferTransaction(
      account,
      recipientWallet,
      parseFloat(amount),
      network
    );

    return new Response(
      JSON.stringify({
        transaction: base64Transaction,
        message: `${amount} SOL sent successfully!`,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST,OPTIONS",
        },
      }
    );
  } catch (error) {
    console.error("Transaction error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Transaction failed" 
      }), 
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}