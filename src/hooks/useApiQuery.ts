
import { ApiResponse } from "@/interfaces/response";
import httpClient from "@/lib/axios-client";
import { serverFetch } from "@/lib/serverFetch";
import { getAllCookies } from "@/services/cookies";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export function useApiQuery<T>(
  queryKey: string[],
  endpoint: string,
  fetchMethod: "axios" | "fetch",

  options?: Omit<UseQueryOptions<ApiResponse<T>, Error>, "queryKey" | "queryFn">
) {
  return useQuery<ApiResponse<T>, Error>({
    queryKey,
    queryFn: async () =>  {

  

 try {

  const cookies = await getAllCookies()
//         if (fetchMethod === "axios") {
//           // Client-side Axios
//           const { data } = await httpClient.get(endpoint,{
//             headers:{
//              "cookie":cookies.toString()
//             }
//           });
//           console.log(data);
          
//           return data
//         } else {
//           // Server-side fetch with ISR support
//                const res = await serverFetch(`/appointments/patient/my-appointments`,{
//                 cache:"default",
//                 credentials:"include"
//                })
//  return res
//         }
 const res = await serverFetch(`/appointments/patient/my-appointments`,{
                cache:"default",
                credentials:"include"
               })
 return res
      } catch (error: any) {
        // toast.error("Fetch Error");
        throw error;
      }
    },
    ...options,
  });
}