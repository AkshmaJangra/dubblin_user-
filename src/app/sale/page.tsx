import type React from "react";
import Sales from "./Sales";
import { getShopCategoriesData } from "../../lib/repos/categoriesRepo";
import {
  getProductsData,
  getShopFilterTypes,
  getShopProductsStatusCount,
} from "../../lib/repos/productsRepo";
import { getFilterValues } from "../../lib/repos/filtertypesRepo";

const Page: React.FC = async () => {
  let show_in_menu = true;
  const productsStatuCount = await getShopProductsStatusCount();

  let limit = 12;
  const productsdata = await getProductsData(limit);
  const filtervalues = await getFilterValues();

  const salesCategories = await getShopCategoriesData({
    child: "no",
    limit: 100000000,
  });
  const shopFilterTypes = await getShopFilterTypes();

  const pageChange = async (pageNumber: number) => {
    "use server";
    let limit = 9;
    return await getProductsData(pageNumber, limit);
  };

  return (
    <div>
      <Sales
        salesCategories={salesCategories.categoriesdata}
        productsData={productsdata}
        pageChange={pageChange}
        productsStatuCount={productsStatuCount}
        shopFilterTypes={shopFilterTypes?.filterTypes}
      />
    </div>
  );
};

export default Page;
