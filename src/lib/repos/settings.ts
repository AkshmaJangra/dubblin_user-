import axios from "../../appUtils/axiosConfig"

export async function getSettings() {
   try {
      const response = await axios.get(`/settings/get`)

      return response.data
   }
   catch (error) {
      //  throw Error(error.response.data.message)
      console.log("error", error)
   }
}