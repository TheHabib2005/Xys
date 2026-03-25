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



export const getAnalysisDetails = async (id) =>{
   const {data}  = await httpClient.post(`/analyzer/analysis/${id}`,{},{
      headers: {
          "Content-Type": "multipart/form-data",
        },
  });
  return data
}


export const handleAnalysis = async (formData)=>{
    const response = await httpClient.post(
        `/analyzer/parse-resume`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data
}