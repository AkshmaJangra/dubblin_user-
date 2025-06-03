import axios from "../../appUtils/axiosConfig"
import { cache } from "react";


export async function getAboutus() {
    try {
        const response1 = await axios.get('/aboutus_topbanner/get');
        const response2 = await axios.get('/aboutus_intro/get');
        const response3 = await axios.get('/aboutus_vision/get');
        const response4 = await axios.get('/aboutus_bottombanner/get');
        const topbanner_data=response1?.data?.TopBanner[0]
        const intro_data=response2.data.Intro[0];
        const vision_data=response3.data.Vision[0];
        const bottombanner_data=response4.data.BottomBanner[0];
        const data={
            topbanner_data,
            intro_data,
            vision_data,
            bottombanner_data
        }
        return data ;
    } catch (error) {
        throw Error(error.response.data.message);
    }
}