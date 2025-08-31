// src/handlers/blinks.ts
import { BlinksMetadata } from "../types/index.ts";

export async function handleBlinks(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/");
  const recipientWallet = pathParts[2];
  const amount = url.searchParams.get("amount") || "0.1";
  const memo = url.searchParams.get("memo") || "Payment";
  const network = url.searchParams.get("network") || "mainnet-beta";
  
  const metadata: BlinksMetadata = {
    type: "action",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    title: memo,
    description: `Payment request for ${amount} SOL`,
    label: "Pay Now",
    links: {
      actions: [{
        label: `Send ${amount} SOL`,
        href: `/api/transaction/${recipientWallet}/${amount}?network=${network}`,
      }],
    },
  };
  
  return new Response(JSON.stringify(metadata), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}