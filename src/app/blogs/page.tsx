import { getblogsbanner } from "../../lib/repos/blogsbannerRepo";
import { getblogspost } from "../../lib/repos/blogspostRepo";
import Blogs from "./_components/blogs";

const Page: React.FC = async () => {
  const blogsbanner = await getblogsbanner();

  const blogspost = await getblogspost();

  const blogdata = { blogsbanner, blogspost };

  return (
    <div>
      <Blogs blogdata={blogdata} />
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
