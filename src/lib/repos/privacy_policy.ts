import axios from "../../appUtils/axiosConfig"

export async function getPrivacyPolicy() {
  try {
    const response = await axios.get(`/privacy_policy/getforuser`)
    console.log("this is pp",response)
    return response
  }
  catch (error) {
    throw Error(error.response.data.message)
  }
}