"use client";

import httpClient from "@/lib/axios-client";
import { useEffect, useState } from "react";
import AnalysisDetails from "./ATSAnalysisDetails";
import JobMatcherDetails from "./JobMatcherAnalysisDetails";
import { AnalysisSkeleton } from "./AnalysisDetailsSkelections";
import { AnalysisError, AnalysisNotFound } from "./AnalysisNotFound";
import { useQuery } from "@tanstack/react-query";

interface Props {
  id: string;
}

const AnalysisDetailsWrapper = ({ id }: Props) => {
  const [loading, setLoading] = useState<boolean>(true);
  // const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
 const cacheKey = `fetch-analysis-details-${id}`
  // const fetchAnalysis = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const response = await httpClient.post(`/analyzer/analysis/${id}`, null, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     setData(response?.data?.data || null);
  //   } catch (err) {
  //     console.error(err);
  //     setError("Something went wrong while loading analysis.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const {data,isLoading,refetch} = useQuery({queryKey:[cacheKey],queryFn:async () => httpClient.post(`/analyzer/analysis/${id}`,{},{
      headers: {
          "Content-Type": "multipart/form-data",
        },
  })})

  // useEffect(() => {
  //   if (id) fetchAnalysis();
  // }, [id]);

  console.log(data);
  

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <AnalysisSkeleton />
      </div>
    );
  }

  if (error) {
  return <AnalysisError/>
  }

  if (!data) {
   return <AnalysisNotFound/>
  }

  return (
    <div className="space-y-6">
   
        <AnalysisDetails  analysisData={data?.data?.data} onRetry={refetch}/>
    </div>
  );
};

export default AnalysisDetailsWrapper;