import React from "react";
import { getRegisterImage } from "../../lib/repos/registerImageRepo";
import VerifyreRegisterOtp from "./VerifyreRegisterOtp";
import { getServerSession } from "next-auth";

const Page: React.FC = async () => {
  const registerImage = await getRegisterImage();
  const session = await getServerSession();
  return (
    <div>
      <VerifyreRegisterOtp data={registerImage} />
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
