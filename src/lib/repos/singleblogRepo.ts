import axios from "../../appUtils/axiosConfig"

export async function getSingleBlog({ slug }) {
  try {
    const response = await axios.get(`blogspost/post/${slug}`)
    return response.data
  }
  catch (error) {
    throw Error(error.response.data.message)
  }
}