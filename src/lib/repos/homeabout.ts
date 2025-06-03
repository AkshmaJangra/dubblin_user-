import axios from "../../appUtils/axiosConfig"
import { cache } from "react";


export async function getHomeAbout() {
    try {

        const responsehomeabout = await axios.get('/homeabout/get');
        const responsehomeaboutList = await axios.get('/homeaboutlist/all');

        const homeaboutdata = [responsehomeabout?.data?.homeaboutData, responsehomeaboutList?.data?.homeaboutListData]
        return homeaboutdata
    } catch (error) {
        throw Error(error?.response?.data?.message);
    }
}