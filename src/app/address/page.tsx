import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../app/api/auth/[...nextauth]/route"; // Adjust the path as necessary
// import CheckoutPage from "./checkout";
import Address from "./Address";
import { getAddress } from "../../lib/repos/addressRepo";

export default async function page() {
  const session = await getServerSession(authOptions);
  const addressData = await getAddress();

  return (
    <div>
      <Address userInfo={session?.user} AddressInfo={addressData} />
    </div>
  );
}
export const dynamic = "force-dynamic";
