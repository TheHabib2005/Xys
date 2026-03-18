"use server"

import { serverFetch } from "@/lib/serverFetch"

export const getUserCredit = async ()=>{
 const res = await serverFetch("/wallet/my-blance");
 return res
}