
import BlogListing from '@/components/modules/moderator/blogs/BlogListing'
import CreateBlogPage from '@/components/modules/moderator/blogs/CreateBlogFrom'
import { useApiQuery } from '@/hooks/useApiQuery'
import React, { Suspense } from 'react'

const ManageBlogs = () => {

 
  return (
   <Suspense>
    <BlogListing/>
   </Suspense>
   
  )
}

export default ManageBlogs