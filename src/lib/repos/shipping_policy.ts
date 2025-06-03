import axios from "../../appUtils/axiosConfig"

export async function getShippingPolicy() {
  try {
    const response = await axios.get(`/shipping_policy/getforuser`)

    return response
  }
  catch (error) {
    throw Error(error.response.data.message)
  }
}