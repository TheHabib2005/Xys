"use server"

export const getUserCredit = async ()=>{
   return  new Promise(res=>setTimeout(() => {
        res(20)
    }, 2000))
}