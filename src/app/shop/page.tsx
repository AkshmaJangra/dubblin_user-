import type React from "react";
import Shop from "./Shop";
import {
  getCategoryBySlug,
  getShopCategoriesData,
} from "../../lib/repos/categoriesRepo";
import {
  getProductsData,
  getShopFilterTypes,
  getShopProductsStatusCount,
} from "../../lib/repos/productsRepo";
import { getFilterValues } from "../../lib/repos/filtertypesRepo";
import { notFound } from "next/navigation";
export async function generateMetadata({ searchParams }) {
  const { category } = searchParams;
  let singleCategory: any;
  if (category && category !== "all") {
    singleCategory = await getCategoryBySlug(category);
  }
  if (singleCategory === 404) {
    notFound();
  }
  return {
    title: `${singleCategory?.category?.meta_title ?? "Dubblin Products"}`,
    description: `${
      singleCategory?.category?.meta_description ?? "Dubblin Products"
    }`,
    tags: `${singleCategory?.category?.meta_tag ?? "Dubblin Products"}`,
  };
}
const Page: React.FC<{
  searchParams: Record<string, string | string[]>;
}> = async ({ searchParams }) => {
  const { category } = searchParams;
  const salesCategories = await getShopCategoriesData();
  let singleCategory: any;
  if (category && category !== "all") {
    singleCategory = await getCategoryBySlug(category);
  }
  const productsdata = await getProductsData();
  const productsStatuCount = await getShopProductsStatusCount();
  const shopFilterTypes = await getShopFilterTypes();
  const filtervalues = await getFilterValues();

  const colourValues = filtervalues.filter((v: any) => {
    return v.types.some((t: any) => t.type === "color");
  });

  const pageChange = async (pageNumber: number) => {
    "use server";
    return await getProductsData(pageNumber, 12);
  };

  return (
    <div>
      <Shop
        salesCategories={salesCategories.sortedData}
        productsData={productsdata}
        colorData={colourValues}
        pageChange={pageChange}
        productsStatuCount={productsStatuCount}
        shopFilterTypes={shopFilterTypes?.filterTypes}
        singleCategory={singleCategory?.category ?? null}
      />
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
