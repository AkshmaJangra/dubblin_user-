import { getServerSession } from "next-auth";
import Personal_info from "./personal_info";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getAddress } from "../../lib/repos/addressRepo";
import { getuserInfo } from "../../lib/repos/userinfoRepo";

const Page: React.FC = async () => {
  const userdata = await getuserInfo();
  const session = await getServerSession();

  const userInfo = userdata?.user;

  return (
    <div>
      <Personal_info userData={userInfo} session={session} />
    </div>
  );
};

export default Page;
