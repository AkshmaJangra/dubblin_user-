import React from "react";
import { getFaq } from "../../lib/repos/faq";
import Faq from "./_components/faq";

const Faqpage: React.FC = async () => {
  const faq = await getFaq();
  return <Faq data={faq} />;
};

export default Faqpage;
export const dynamic = "force-dynamic";
