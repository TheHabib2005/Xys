import { useState } from "react"

export function useResumeBuilder(){

  const [step,setStep] = useState(0)

  const [formData,setFormDataState] = useState({
    personalInfo:{
      fullName:"",
      email:"",
      phone:"",
      location:""
    },
    summary:"",
    experience:[],
    education:[],
    skills:[]
  })

  const setFormData = (key:string,value:any)=>{
    setFormDataState(prev=>({
      ...prev,
      [key]:value
    }))
  }

  const next = ()=> setStep(s=>s+1)
  const prev = ()=> setStep(s=>s-1)

  const isValid = true // validation logic

  return {
    step,
    formData,
    setFormData,
    next,
    prev,
    isValid
  }

}