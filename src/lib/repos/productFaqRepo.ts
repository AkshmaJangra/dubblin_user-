import axios from "../../appUtils/axiosConfig"

export async function getProductFaq(productId) {
  try {
    const response = await axios.get(`/productfaq/all?productId=${productId}`)
    return response.data.productFaqData;
  }
  catch (error) {
    throw Error(error?.response?.data?.message)
  }
}