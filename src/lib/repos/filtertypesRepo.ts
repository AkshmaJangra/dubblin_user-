import axios from "../../appUtils/axiosConfig"

export async function getFilterValues() {
  try {
    const response = await axios.get(`/filtervalues/all`)
    return response?.data?.filterValuesdata;

  }
  catch (error: any) {
    throw Error(error?.response?.data?.message)
  }
}