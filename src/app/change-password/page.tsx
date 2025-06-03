import React, { useState } from "react";
import ChangePassword from "./changepassword";
import { getRegisterImage } from "../../lib/repos/registerImageRepo";

const Page: React.FC = async() => {
   const registerImage = await getRegisterImage()
 
  return (

  <div>
    <ChangePassword data={registerImage}/>
  </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
