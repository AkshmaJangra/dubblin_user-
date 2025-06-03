"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
  FaChevronDown,
} from "react-icons/fa";
import Link from "next/link";
import { useAppDispatch } from "../../lib/hooks";
import { createEmail } from "../../lib/AllSlices/newsletterSlice";
import { toast } from "sonner";
// Extend the Window interface to include grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}
type ExpandableSectionProps = {
  title: string;
  children: React.ReactNode;
};

interface FooterProps {
  footerdata: any;
}
const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure the component only renders on the client-side
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevent SSR mismatch

  return (
    <div className="md:hidden">
      <button
        className="w-full text-left py-2 text-lg font-semibold flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {title}
        <FaChevronDown
          className={`transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>
      {isExpanded && <div className="mt-2">{children}</div>}
    </div>
  );
};
interface FooterProps {
  footerdata: any; // Replace `any[]` with the actual structure if possible
}

const Footer: React.FC<FooterProps> = ({ footerdata }) => {
  // const { footerdata } = props;
  const footerdataa = footerdata[0];
  const dispatch = useAppDispatch();
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleEmail = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true); // Start loader
      //Execute reCAPTCHA
      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_APP_SITE_KEY || "",
        {
          action: "submit",
        }
      );
      const res = await dispatch(createEmail({ email, token })).unwrap();

      if (res.success) {
        toast.success(res?.message);
      }
    } catch (error) {
      toast.warning(error);
    } finally {
      setIsLoading(false); // Start loader
    }
  };

  useEffect(() => {
    // Ensure the component only renders on the client-side
    setIsClient(true);
  }, []);

  return (
    <footer className="font-Outfit text-black bg-white">
      {/* Newsletter Section */}
      <div
        className="p-4 sm:p-10 w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/footer.png')" }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto">
          <div className="text-white font-semibold text-2xl sm:text-3xl mb-4 sm:mb-0 text-center sm:text-left">
            <h2>
              JOIN OUR <br />
              NEWSLETTER
            </h2>
          </div>

          <div className="relative w-full sm:w-[500px] bg-gray-100 rounded-2xl shadow-md p-1.5">
            {isClient && (
              <form>
                <input
                  type="email"
                  className="w-full pl-2 py-4 text-base sm:text-xl text-black bg-transparent rounded-lg focus:outline-none"
                  placeholder="Enter Email"
                  value={email}
                  onChange={handleEmail}
                />
              </form>
            )}
            <button
              className="absolute right-0 top-0 bottom-0 px-4 sm:px-6 bg-red-800 text-white font-medium rounded-xl focus:outline-none text-sm sm:text-base"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span>Subscribing...</span>
                </>
              ) : (
                "Subscribe"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mt-5 max-w-7xl mx-auto">
        <div className="grid px-4 sm:px-6 lg:px-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-24">
          {/* Company Info */}
          <div className="space-y-6">
            <Image
              src={
                footerdataa?.logo?.startsWith("/") ||
                footerdataa?.logo?.startsWith("http")
                  ? footerdataa?.logo
                  : "/fallback-logo.png"
              }
              alt="Dubblin Logo"
              width={100}
              height={100}
            />
            <p className="text-sm">{footerdataa?.description}</p>
            <h2 className="border-y-2 border-yellow-700 w-28 text-center text-xl">
              Follow us
            </h2>
            <div className="flex gap-4 text-3xl">
              {/* <FaFacebook className="hover:text-blue-600 cursor-pointer" />
              <FaInstagram className="hover:text-pink-600 cursor-pointer" />
              <FaTwitter className="hover:text-blue-400 cursor-pointer" />
              <FaYoutube className="hover:text-red-600 cursor-pointer" />
              <FaLinkedin className="hover:text-blue-800 cursor-pointer" /> */}
              {footerdataa?.social_icon1_link && (
                <Link href={footerdataa?.social_icon1_link}>
                  <img
                    src={footerdataa?.social_icon1}
                    className="w-8 h-8"
                    alt=""
                  />
                </Link>
              )}
              {footerdataa?.social_icon2_link && (
                <Link href={footerdataa?.social_icon2_link}>
                  <img
                    src={footerdataa?.social_icon2}
                    className="w-8 h-8"
                    alt=""
                  />
                </Link>
              )}
              {footerdataa?.social_icon3_link && (
                <Link href={footerdataa?.social_icon3_link}>
                  <img
                    src={footerdataa?.social_icon3}
                    className="w-8 h-8"
                    alt=""
                  />
                </Link>
              )}
              {footerdataa?.social_icon4_link && (
                <Link href={footerdataa?.social_icon4_link}>
                  <img
                    src={footerdataa?.social_icon4}
                    className="w-8 h-8"
                    alt=""
                  />
                </Link>
              )}
              {footerdataa?.social_icon5_link && (
                <Link href={footerdataa?.social_icon5_link}>
                  <img
                    src={footerdataa?.social_icon5}
                    className="w-8 h-8"
                    alt=""
                  />
                </Link>
              )}
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <ExpandableSection title={footerdataa?.title1}>
              <ul className="space-y-2 ml-4 list-disc text-sm">
                {footerdataa?.title1_link1_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title1_link1}
                      className="hover:underline"
                    >
                      {footerdataa?.title1_link1_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title1_link2_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title1_link2}
                      className="hover:underline"
                    >
                      {footerdataa?.title1_link2_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title1_link3_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title1_link3}
                      className="hover:underline"
                    >
                      {footerdataa?.title1_link3_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title1_link4_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title1_link4}
                      className="hover:underline"
                    >
                      {footerdataa?.title1_link4_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title1_link5_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title1_link5}
                      className="hover:underline"
                    >
                      {footerdataa?.title1_link5_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title1_link6_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title1_link6}
                      className="hover:underline"
                    >
                      {footerdataa?.title1_link6_heading}
                    </Link>
                  </li>
                )}
              </ul>
            </ExpandableSection>
            <div className="hidden md:block">
              <h3 className="mb-4 text-lg font-semibold">
                {footerdataa?.title1}
              </h3>
              <ul className="space-y-2  list-disc text-sm">
                {footerdataa?.title1_link1_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title1_link1}
                      className="hover:underline"
                    >
                      {footerdataa?.title1_link1_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title1_link2_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title1_link2}
                      className="hover:underline"
                    >
                      {footerdataa?.title1_link2_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title1_link3_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title1_link3}
                      className="hover:underline"
                    >
                      {footerdataa?.title1_link3_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title1_link4_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title1_link4}
                      className="hover:underline"
                    >
                      {footerdataa?.title1_link4_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title1_link5_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title1_link5}
                      className="hover:underline"
                    >
                      {footerdataa?.title1_link5_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title1_link6_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title1_link6}
                      className="hover:underline"
                    >
                      {footerdataa?.title1_link6_heading}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <ExpandableSection title={footerdataa?.title2}>
              <p className="text-pink-700 mb-2">
                {footerdataa?.title2_subtitle}
              </p>
              <ul className="list-disc  ml-5 space-y-2 text-sm">
                {footerdataa?.title2_link1_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title2_link1}
                      className="hover:underline"
                    >
                      {footerdataa?.title2_link1_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title2_link2_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title2_link2}
                      className="hover:underline"
                    >
                      {footerdataa?.title2_link2_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title2_link3_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title2_link3}
                      className="hover:underline"
                    >
                      {footerdataa?.title2_link3_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title2_link4_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title3_link4}
                      className="hover:underline"
                    >
                      {footerdataa?.title2_link4_heading}
                    </Link>
                  </li>
                )}
              </ul>
            </ExpandableSection>
            <div className="hidden md:block">
              <h3 className="mb-4 text-lg font-semibold">
                {footerdataa?.title2}
              </h3>
              <p className="text-pink-700 mb-2">
                {footerdataa?.title2_subtitle}
              </p>
              <ul className="space-y-2 list-disc text-sm">
                {footerdataa?.title2_link1_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title2_link1}
                      className="hover:underline"
                    >
                      {footerdataa?.title2_link1_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title2_link2_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title2_link2}
                      className="hover:underline"
                    >
                      {footerdataa?.title2_link2_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title2_link3_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title2_link3}
                      className="hover:underline"
                    >
                      {footerdataa?.title2_link3_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title2_link4_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title2_link4}
                      className="hover:underline"
                    >
                      {footerdataa?.title2_link4_heading}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Online Channel Partner */}
          <div>
            <ExpandableSection title={footerdataa?.title3}>
              <p className="text-pink-700 mb-2">
                {footerdataa?.title3_subtitle}
              </p>
              <ul className="space-y-2  ml-5 list-disc text-sm">
                {footerdataa?.title3_link1_heading && (
                  <li>
                    <Link
                      href={`tel:+${footerdataa?.title3_link1}`}
                      className="hover:underline"
                    >
                      {footerdataa?.title3_link1_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title3_link2_heading && (
                  <li>
                    <Link
                      href={`mailto:${footerdataa?.title3_link2}`}
                      className="hover:underline"
                    >
                      {footerdataa?.title3_link2_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title3_link3_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title3_link3}
                      className="hover:underline"
                    >
                      {footerdataa?.title3_link3_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title3_link4_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title3_link4}
                      className="hover:underline"
                    >
                      {footerdataa?.title3_link4_heading}
                    </Link>
                  </li>
                )}
              </ul>
            </ExpandableSection>
            <div className="hidden md:block">
              <h3 className="mb-4 text-lg font-semibold">
                {footerdataa?.title3}
              </h3>
              <p className="text-pink-700 mb-2">
                {footerdataa?.title3_subtitle}
              </p>
              <ul className="space-y-2 list-disc text-sm">
                {footerdataa?.title3_link1_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title3_link1}
                      className="hover:underline"
                    >
                      {footerdataa?.title3_link1_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title3_link2_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title3_link2}
                      className="hover:underline"
                    >
                      {footerdataa?.title3_link2_heading}
                    </Link>
                  </li>
                )}
                {footerdataa?.title3_link3_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title3_link3}
                      className="hover:underline"
                    >
                      {footerdataa?.title3_link3_heading}
                    </Link>
                  </li>
                )}

                {footerdataa?.title3_link4_heading && (
                  <li>
                    <Link
                      href={footerdataa?.title3_link4}
                      className="hover:underline"
                    >
                      {footerdataa?.title3_link4_heading}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 py-4 bg-black text-white text-center text-sm border-t">
        <p>
          Copyright &copy; {new Date().getFullYear()} Dubblin | Developed By{" "}
          <a href="https://aarvytechnologies.com/" className="cursor-pointer">
            Aarvy Technologies
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
