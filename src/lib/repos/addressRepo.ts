import { getServerSession } from "next-auth";
import axios from "../../appUtils/axiosConfig"
import { cache } from "react";
import { authOptions } from "../../app/api/auth/[...nextauth]/route";


export async function getAddress() {
    const session = await getServerSession(authOptions);
    if (!session || !session?.user || !session?.user?._id) {
        console.error("No session found, returning null");
        return [];
    }
    try {
        const response = await axios.get(`/shipping_address/getaddress/${session?.user?._id}`);
        return response?.data?.ShippingAddressDataUser;
    } catch (error) {
        throw Error(error?.response?.data?.message);
    }
}