"use client"
import { useApiQuery } from '@/hooks/useApiQuery'
import httpClient from '@/lib/axios-client';
import React, { useEffect, useState } from 'react'
import { useStackId } from 'recharts/types/cartesian/BarStack';
import AnalysisDetails from './ATSAnalysisDetails';
import JobMatcherDetails from './JobMatcherAnalysisDetails';

const AnalysisDetailsWrapper = ({id}:{id:string}) => {

    const [loading,setLoadign] = useState(false);
    const [data, setData] = useState(null)

    const fetchData = async()=>{
        const response = await httpClient.post(
        `/analyzer/analysis/${id}`, 
        
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setData(response.data.data)
    setLoadign(false)
    }

      useEffect(()=>{
      fetchData()
      },[])
    

      if(loading) return <h1>Loading.....</h1>
      if(!data && !loading) return <h1> not found</h1>

  return (
    <div>

 {
    data && data?.analysis_type === "ATS_SCAN" ? <AnalysisDetails data={data}/> : <JobMatcherDetails data={data}/>
 }

    </div>
  )
}

export default AnalysisDetailsWrapper