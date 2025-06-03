import React, { useState, useEffect } from "react";

import Register from "./register";
import { getRegisterImage } from "../../lib/repos/registerImageRepo";

const Page: React.FC = async () => {
  const registerImage = await getRegisterImage();
  return (
    <div>
      <Register data={registerImage} />
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
