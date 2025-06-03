
import React, { useState } from "react";

import ForgetPassword from "./forget-password";
import { getRegisterImage } from "../../lib/repos/registerImageRepo";

const Page: React.FC = async() => {
 
  const registerImage = await getRegisterImage()
  return(
    <div>
      <ForgetPassword data={registerImage}/>
    </div>
  )
};

export default Page;
