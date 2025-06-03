import axios from "../../appUtils/axiosConfig"

export async function getReturnPolicy() {
  try {
    const response = await axios.get(`/return_policy/getforuser`)

    return response
  }
  catch (error) {
    throw Error(error.response.data.message)
  }
}