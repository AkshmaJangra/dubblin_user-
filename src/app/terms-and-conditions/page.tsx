import React from "react";
import { getTermsConditions } from "../../lib/repos/terms_conditions";

export async function generateMetadata() {
  return {
    title: "Dubblin Terms And Conditions",
    description: "Dubblin Terms And Conditions",
    tags: "Dubblin Terms And Conditions",
  };
}

const TermsAndConditionsPage: React.FC = async () => {
  const data = await getTermsConditions();
  const description = data.data?.TermsAndConditions[0]?.description;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-black text-center mt-8 md:mt-16 mb-8 text-4xl font-bold font-Cinzel">
          Terms & Conditions
        </h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {description ? (
            <div
              className="p-6 sm:p-8 space-y-6 text-gray-800 font-Outfit text-base sm:text-lg"
              dangerouslySetInnerHTML={{ __html: description }}
            ></div>
          ) : (
            <div className="p-6 sm:p-8 text-center text-gray-800 font-Outfit text-base sm:text-lg">
              <p>No terms and conditions are available at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;

export const dynamic = "force-dynamic";