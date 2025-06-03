import React from "react";
import Login from "./login";
import { getRegisterImage } from "../../lib/repos/registerImageRepo";

const Page: React.FC = async () => {
  const registerImage = await getRegisterImage();
  return (
    <div>
      <Login data={registerImage} />
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
