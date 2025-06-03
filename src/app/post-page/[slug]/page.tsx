

import React from 'react';
import { CalendarDays } from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import Image from 'next/image';
import BlogPage from './blogpage';
import { getSingleBlog } from '../../../lib/repos/singleblogRepo';

const Page: React.FC = async({params}: { params: { slug: string }}) => {
  const slug= params.slug
  const singlePost =await getSingleBlog({slug})
  return (
   <div>
    <BlogPage singlepost={singlePost}/>
   </div>
  );
};

export default Page;
export const dynamic = "force-dynamic"
