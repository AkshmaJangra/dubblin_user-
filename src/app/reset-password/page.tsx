
import { getRegisterImage } from "../../lib/repos/registerImageRepo";
import ResetPassword from "./resetpassword";

const Page: React.FC = async() => {
    const registerImage = await getRegisterImage()

  return (
    <div>
      <ResetPassword data={registerImage}/>
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
