
import React from 'react'

import About from './_components/about'
import { getAboutus } from '../../lib/repos/aboutusRepo'

const Page: React.FC = async() => {
   const data=await getAboutus();  
   
  return (
    <div>
      <About aboutdata={data}/>
    </div>
  )
}

export default Page
export const dynamic = "force-dynamic"
