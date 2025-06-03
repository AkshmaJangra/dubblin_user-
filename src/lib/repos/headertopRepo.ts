import axios from "../../appUtils/axiosConfig"

export async function getHeaderTop() {
  try {
    const response = await axios.get(`/headerTop/get`)

    return response
  }
  catch (error) {
    throw Error(error.response.data.message)
  }
}