import axios from "../../appUtils/axiosConfig"

export async function getTermsConditions() {
  try {
    const response = await axios.get(`/terms_conditions/getforuser`)

    return response
  }
  catch (error) {
    throw Error(error.response.data.message)
  }
}