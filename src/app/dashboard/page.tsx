import React, { useState } from "react";
import { CiUser } from "react-icons/ci";
import { GrDocumentTime } from "react-icons/gr";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";
// import { Dashboard, PersonalInfo, EditAddress, OrderHistory } from '../profile/page';
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Dashboard from "./_components/dashboard";
import { getuserInfo } from "../../lib/repos/userinfoRepo";
import { getOrderHistory } from "../../lib/repos/orderhistoryRepo";
import { getServerSession } from "next-auth";
import { getAddress } from "../../lib/repos/addressRepo";

const Page: React.FC = async () => {
  // const router=useRouter()
  const userdata = await getuserInfo();
  const recentOrders = await getOrderHistory();
  const addressData = await getAddress();

  const userInfo = userdata?.user;
  const session = await getServerSession();
  return (
    <div>
      <Dashboard
        userInfo={userInfo}
        recentOrders={recentOrders}
        session={session}
        AddressInfo={addressData}
      />
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
