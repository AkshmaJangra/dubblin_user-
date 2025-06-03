import React from "react";

import Orderhistory from "./orderhistory";
import { getOrderHistory } from "../../lib/repos/orderhistoryRepo";
import { getuserInfo } from "../../lib/repos/userinfoRepo";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

const Page: React.FC = async () => {
  //  const session = await getServerSession(authOptions);
  const orderdetails = await getOrderHistory();
  const userdata = await getuserInfo();

  const userInfo = userdata?.user;
  return (
    <div>
      <Orderhistory userInfo={userInfo} orders={orderdetails} />
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
