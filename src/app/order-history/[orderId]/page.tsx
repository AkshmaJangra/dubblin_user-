"use client";
import React, { useEffect } from "react";
import Singleorder from "./singleorder";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";

import { getSingleOrder } from "../../../lib/repos/singleorderRepo";

const page = () => {
  const pathname = usePathname();
  const orderId = pathname?.split("/").pop();
  const [order, setOrder] = React.useState(null);
  // const orderDetails= await getSingleOrder(orderId)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const orderDetails = await getSingleOrder(orderId);
      setOrder(orderDetails);
    };

    fetchOrderDetails();
  }, []);
  return (
    <div>
      <Singleorder orderDetails={order} />
    </div>
  );
};

export default page;
