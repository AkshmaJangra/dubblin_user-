import axios from "../../appUtils/axiosConfig"

export async function getRegisterImage() {
  try {
    const response = await axios.get(`/registerimage/get`)

    return response.data.RegisterImage[0];
  }
  catch (error) {
    throw Error(error.response.data.message)
  }
}