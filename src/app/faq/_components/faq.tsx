"use client";
import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, ChevronRight } from "lucide-react";

function FAQ({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 ">
      <button
        className={`w-full flex items-center justify-between p-4 rounded-lg text-left transition-all duration-200 ${
          isOpen
            ? "bg-indigo-50 shadow-md"
            : "bg-white hover:bg-gray-50 shadow-sm"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <HelpCircle
            className={`w-5 h-5 ${
              isOpen ? "text-indigo-600" : "text-indigo-400"
            }`}
          />
          <span
            className={`font-medium ${
              isOpen ? "text-indigo-900" : "text-gray-700"
            }`}
          >
            {question}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-indigo-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      <div
        className={`transition-all duration-200 overflow-hidden ${
          isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="p-4 text-gray-600 bg-white rounded-b-lg shadow-sm">
          {answer}
        </p>
      </div>
    </div>
  );
}
const faq = (props) => {
  const accordionData = props.data;
  const [selectedQuestion, setSelectedQuestion] = useState("");

  return (
    <div className="min-h-screen font-Outfit bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Frequently Asked Questions
        </h2>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {accordionData.map((faq, index) => (
            <div
              key={index}
              className={`border-b border-gray-100 last:border-0 ${
                selectedQuestion === faq.question ? "bg-blue-50/50" : ""
              }`}
            >
              <button
                onClick={() =>
                  setSelectedQuestion(
                    selectedQuestion === faq.question ? "" : faq.question
                  )
                }
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <HelpCircle
                    className={`w-5 h-5 flex-shrink-0 ${
                      selectedQuestion === faq.question
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`font-medium text-left ${
                      selectedQuestion === faq.question
                        ? "text-blue-900"
                        : "text-gray-700"
                    }`}
                  >
                    {faq.question}
                  </span>
                </div>
                <ChevronRight
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                    selectedQuestion === faq.question
                      ? "rotate-90 text-blue-600"
                      : "text-gray-400"
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  selectedQuestion === faq.question
                    ? "max-h-48 opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <p className="text-gray-600 px-6 pb-6 pl-[3.75rem]">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    // <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    //   <div className="max-w-3xl mx-auto">
    //     <h1 className="text-4xl font-bold text-center text-black mb-12">
    //       Frequently Asked Questions
    //     </h1>
    //     <div className="space-y-6">
    //       {accordionData.map((faq: any, index: number) => (
    //         <FAQ key={index} question={faq.question} answer={faq.answer} />
    //       ))}
    //     </div>
    //   </div>
    // </div>
  );
};

export default faq;
