import axios from "../../appUtils/axiosConfig"

export async function getSales() {
   try {
      const response = await axios.get(`/sales/all`)
      return response?.data
   }
   catch (error) {
      throw Error(error.response.data.message)
   }
}