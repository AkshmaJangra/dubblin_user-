import { getSales } from "../lib/repos/sales";
import Hero from "./Components/Hero";
import BestSelling from "./Components/BestSelling";
import Categories from "./Components/Categories";
import Bannner from "./Components/Bannner";
import NewArrivels from "./Components/NewArrivels";
import About from "./Components/About";
import InstagramReels from "./Components/InstagramReels";
import { getMidbanner } from "../lib/repos/midbanner";
import {
  getHomeCategories,
  getHomeSliders,
  getNewArrivals,
} from "../lib/repos/homesliders";
import { getProductsData } from "../lib/repos/productsRepo";
import { getHomeAbout } from "../lib/repos/homeabout";
import PopupWrapper from "./pop-up/popupwrapper"

import {
  getCategoriesData,
  getHomeCategoriesData,
} from "../lib/repos/categoriesRepo";

const Home = async () => {
  const data = await getSales();

  const bannerdata = await getMidbanner();
  const herodata = await getHomeSliders();
  const productsData = await getProductsData();
  const homecategoriesData = await getHomeCategories();
  let show_in_home = true;
  let limit = 1000000;

  const home_categoriesData = await getHomeCategoriesData({
    show_in_home,
    limit,
  });
  const newArrivels = await getNewArrivals();
  return (
    <div>
      {/* <Header /> */}
      <PopupWrapper />
      <Hero slidersdata={herodata} />
      <BestSelling salesData={data} />
      <InstagramReels />
      <Categories
        categoriesData={home_categoriesData?.homeCategories}
        homecategoriesData={homecategoriesData}
      />
      <Bannner midbannerdata={bannerdata} />
      <NewArrivels newArrivels={productsData} newArrivelstitle={newArrivels} />
      <About />
    </div>
  );
};

export default Home;
export const dynamic = "force-dynamic";
