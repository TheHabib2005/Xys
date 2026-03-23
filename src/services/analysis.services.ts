"use server";

import httpClient from "@/lib/axios-client";
import { serverApi } from "@/lib/serverApi";
import { cookies } from "next/headers";

export const deleteAnalysis = async (analysisId:string) =>{
    const cookieStore = await cookies()
    const res = await httpClient.delete(`/analyzer/analysis/delete/${analysisId}`,{
          headers: {
        "cookie": cookieStore.toString()
      }
    });
    if(res.status === 200 || res.data.success){
         return {
        success: true,
        message: res.data.message,
      }

    }

}

