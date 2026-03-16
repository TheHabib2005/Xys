import ResumeBuilderPage from '@/components/modules/resume/ResumeBuilder'
import TemplateDetails from '@/components/modules/resume/TemplateDetails'
import React from 'react'

const ResumeBuilder =async ({params}:{params:{id:string}}) => {
const {id} = await params

  return (
    <div>
  
        <TemplateDetails id={id}/>
    </div>
  )
}

export default ResumeBuilder