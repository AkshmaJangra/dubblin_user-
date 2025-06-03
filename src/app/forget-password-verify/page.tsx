
import ForgetPasswordVerify from "./forgetpasswordverify";
import { getRegisterImage } from "../../lib/repos/registerImageRepo";

const Page = async() => {
    const registerImage = await getRegisterImage()
  return (
    <div>
      <ForgetPasswordVerify data={registerImage} />
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
