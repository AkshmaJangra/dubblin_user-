import axios from "../../appUtils/axiosConfig"
import { getServerSession } from "next-auth";
import { authOptions } from "../../app/api/auth/[...nextauth]/route";

export async function getOrderHistory() {
    const session = await getServerSession(authOptions);
    if (!session || !session?.user || !session?.user?._id) {
        console.error("No session found, returning null");
        return null;
    }

    try {
        const response = await axios.get(`order/getorders/${session?.user?._id}`);
        return response?.data?.orders;
    } catch (error) {
        console.error("Error fetching order history:", error?.response?.data?.message || error);
        throw new Error(error?.response?.data?.message || "Failed to fetch order history");
    }
}
