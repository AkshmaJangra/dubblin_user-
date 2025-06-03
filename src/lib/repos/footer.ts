import axios from "../../appUtils/axiosConfig"

export async function getHomeFooter() {
  try {
    const response = await axios.get(`/home_footer/get`)
    return response?.data?.updatedFooterData;
  }
  catch (error: any) {
    throw Error(error?.response?.data?.message)
  }
}