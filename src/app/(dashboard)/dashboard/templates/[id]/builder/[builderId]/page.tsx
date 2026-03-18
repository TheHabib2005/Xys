
import React from 'react'

import { useApiQuery } from '@/hooks/useApiQuery'
import  ResumeBuilder from '@/components/modules/resume/ResumeBuilder'


const ResumeBuilderPage = async({params}) => {
    const {id,builderId} = await params


  return <ResumeBuilder id={id} />;
}

export default ResumeBuilderPage