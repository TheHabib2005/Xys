
import TemplateEditPage from '@/components/modules/admin/templatess/editor/TemplateEditPage';
import { useApiQuery } from '@/hooks/useApiQuery'
import React from 'react'

const page = async({params}:{params:{id:string}}) => {

    const {id} = await params;

  

  return (
    <div>
<TemplateEditPage id={id}/>
    </div>
  )
}

export default page