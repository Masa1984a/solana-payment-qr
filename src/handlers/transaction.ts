// src/handlers/transaction.ts
import { createTransferTransaction } from "../utils/solana.ts";

export async function handleTransaction(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/");
  let recipientWallet: string | undefined;
  let amount: string | null = null;
  // 新: /api/actions/pay/:recipient?amount=...
  if (pathParts[2] === "actions" && pathParts[3] === "pay") {
    recipientWallet = pathParts[4];
    amount = url.searchParams.get("amount");
  } else {
    // 旧: /api/transaction/:recipient/:amount
    recipientWallet = pathParts[3];
    amount = pathParts[4] ?? null;
  }
  const network = url.searchParams.get("network") || "mainnet-beta";
  
  try {
    const body = await req.json();
    const { account } = body;
    
    if (!account) {
      throw new Error("Account address is required");
    }

    if (!recipientWallet) {
      throw new Error("Recipient address is required");
    }
    if (!amount) {
      throw new Error("Amount is required");
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