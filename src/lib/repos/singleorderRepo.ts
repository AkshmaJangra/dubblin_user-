import axios from "../../appUtils/axiosConfig"

export async function getSingleOrder(orderId: any) {

  try {
    const response = await axios.get(`/order/getsingleorder/${orderId}`)
    return response?.data?.order
  }
  catch (error) {
    throw Error(error.response.data.message)
  }
}