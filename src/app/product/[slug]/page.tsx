import React from "react";
import ProductsDetails from "./product-details";
import {
  getProductsData,
  getSinglrProductData,
} from "../../../lib/repos/productsRepo";
import { getNewArrivals } from "../../../lib/repos/homesliders";
import { getProductFaq } from "../../../lib/repos/productFaqRepo";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params?.slug;
  const data = await getSinglrProductData({ slug });
  return {
    title: `${data?.productData?.meta_title ?? "Dubblin Product"}`,
    description: `${data?.productData?.meta_description ?? "Dubblin Product"}`,
    tags: `${data?.productData?.meta_tag ?? "Dubblin Product"}`,
  };
}

export default async function page({ params }: { params: { slug: string } }) {
  const slug = params?.slug;
  const data = await getSinglrProductData({ slug });
  const allProducts = await getProductsData();
  const newArrivels = await getNewArrivals();
  const productFAQ = await getProductFaq(data?.productData?._id);

  return (
    <div>
      <ProductsDetails
        productData={data?.productData}
        allProducts={allProducts}
        newArrivelstitle={newArrivels}
        productFaq={productFAQ}
      />
    </div>
  );
}
export const dynamic = "force-dynamic";
