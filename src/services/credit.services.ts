"use server"

import { serverFetch } from "@/lib/serverFetch"
import { revalidateTag } from "next/cache";

export const getUserCredit = async ()=>{
 const res = await serverFetch("/wallet/my-blance");
 return res
}


export async function refreshWallet() {
  // Use the profile argument your specific setup requires
  console.log("REVALIDATING NOW...");
  revalidateTag("/wallet/my-blance", "default") 
}