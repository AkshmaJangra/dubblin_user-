import axios from "../../appUtils/axiosConfig"

export async function getMidbanner() {
  try {
    const response = await axios.get(`/midbanner/get`)

    return response?.data
  }
  catch (error) {
    throw Error(error.response.data.message)
  }
}