// src/handlers/transaction.ts
import { createTransferTransaction } from "../utils/solana.ts";

export async function handleTransaction(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/");
  const recipientWallet = pathParts[3];
  const amount = pathParts[4];
  
  try {
    const body = await req.json();
    const { account } = body;

    const base64Transaction = await createTransferTransaction(
      account,
      recipientWallet,
      parseFloat(amount)
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
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
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