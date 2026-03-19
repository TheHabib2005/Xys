"use client";

import httpClient from "@/lib/axios-client";
import { useEffect, useState } from "react";
import AnalysisDetails, { AnalysisSkeleton } from "./ATSAnalysisDetails";
import JobMatcherDetails from "./JobMatcherAnalysisDetails";

interface Props {
  id: string;
}

const AnalysisDetailsWrapper = ({ id }: Props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await httpClient.post(`/analyzer/analysis/${id}`, null, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setData(response?.data?.data || null);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while loading analysis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchAnalysis();
  }, [id]);

  // 🔄 Loading State (clean + centered)
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <AnalysisSkeleton />
      </div>
    );
  }

  // ❌ Error State (modern card UI)
  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 max-w-md w-full text-center border border-gray-100 dark:border-gray-800">
          <div className="text-5xl mb-4">⚠️</div>

          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Failed to load analysis
          </h2>

          <p className="text-gray-500 mt-2">
            Please check your connection or try again.
          </p>

          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={fetchAnalysis}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Retry
            </button>

            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🔍 Empty State (premium look)
  if (!data) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="relative bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-10 max-w-lg w-full text-center border border-gray-100 dark:border-gray-800 overflow-hidden">

          {/* subtle gradient glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full"></div>

          <div className="text-6xl mb-4">🔍</div>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Analysis Not Found
          </h2>

          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            The analysis you're looking for doesn’t exist or may have expired.
            Try going back to your dashboard or re-running the analysis.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button
              onClick={fetchAnalysis}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Retry
            </button>

            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Main Content
  return (
    <div className="space-y-6">
      {data.analysis_type === "ATS_SCAN" ? (
        <AnalysisDetails data={data} />
      ) : (
        <JobMatcherDetails data={data} />
      )}
    </div>
  );
};

export default AnalysisDetailsWrapper;