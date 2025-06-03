import { useSession } from "next-auth/react"
import axios from "../../appUtils/axiosConfig"
import { getServerSession } from "next-auth";
import { authOptions } from "../../app/api/auth/[...nextauth]/route" // Adjust the path as necessary

export async function getuserInfo() {


  try {
    // Get session server-side
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    const token = session?.user?.token; // Ensure token is stored in session
    const userId = session?.user?.id; // Ensure user ID is stored in session

    // const token= localStorage.getItem("token")
    // const userId=localStorage.getItem("userId")


    // Fetch user data from backend
    const response = await axios.get(`/users/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
  catch (error) {

    throw Error(error.response?.data.message)
  }
}