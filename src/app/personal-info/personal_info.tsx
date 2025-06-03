"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import {
  LogOut,
  Settings,
  X,
  User,
  Home,
  MapPin,
  Clock,
  ChevronRight,
  Edit,
  Save,
  Upload,
} from "lucide-react";
import { useAppDispatch } from "../../lib/hooks";
import { updateUserProfile } from "../../lib/AllSlices/userauthSlice";

// Define the user data type
interface UserData {
  _id?: string;
  name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  profile_image?: string;
  createdAt?: string;
}

interface PersonalInfoProps {
  userData?: UserData;
  session?: any;
}

const Personal_info: React.FC<PersonalInfoProps> = ({
  userData = {},
  session,
}) => {
  const router = useRouter();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state and validation
  const [formData, setFormData] = useState({
    firstName: userData?.name || "",
    lastName: userData?.last_name || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    profile_image: userData?.profile_image || session?.user?.image,
  });

  // Preview state for image
  const [imagePreview, setImagePreview] = useState<string | null>(
    userData?.profile_image || null
  );

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profile_image: "",
  });

  useEffect(() => {
    setFormData({
      firstName: userData?.name || "",
      lastName: userData?.last_name || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      profile_image: userData?.profile_image || session?.user?.image,
    });

    // Set image preview from user data if available
    setImagePreview(userData?.profile_image || null);
  }, [userData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsEditProfileOpen(false);
      }
    };

    if (isEditProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditProfileOpen]);

  useEffect(() => {
    if (isEditProfileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isEditProfileOpen]);

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
      });
      router.push("/");
      toast.success("Logged out successfully");
      router.refresh();
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const menuItems = [
    { icon: <Home size={20} />, label: "Dashboard", href: "/dashboard" },
    {
      icon: <User size={20} />,
      label: "Personal Info",
      href: "/personal-info",
      active: true,
    },
    { icon: <MapPin size={20} />, label: "Addresses", href: "/address" },
    {
      icon: <Clock size={20} />,
      label: "Order History",
      href: "/order-history",
    },
  ];

  const handleResetPassword = () => {
    if (userData?._id) {
      router.push(`/reset-password?id=${userData._id}`);
    } else {
      toast.error("User ID not found");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Validation functions
  const validateFirstName = (name: string) => {
    if (!name.trim()) {
      setFormErrors((prev) => ({
        ...prev,
        firstName: "First name is required",
      }));
      return false;
    }

    if (name.length < 2) {
      setFormErrors((prev) => ({
        ...prev,
        firstName: "First name must be at least 2 characters",
      }));
      return false;
    }

    if (name.includes(" ")) {
      setFormErrors((prev) => ({
        ...prev,
        firstName: "First name cannot contain spaces",
      }));
      return false;
    }

    if (!/^[a-zA-Z'-]+$/.test(name)) {
      setFormErrors((prev) => ({
        ...prev,
        firstName:
          "First name can only contain letters, hyphens and apostrophes",
      }));
      return false;
    }

    setFormErrors((prev) => ({ ...prev, firstName: "" }));
    return true;
  };

  const validateLastName = (name: string) => {
    if (!name.trim()) {
      setFormErrors((prev) => ({ ...prev, lastName: "Last name is required" }));
      return false;
    }

    if (name.trim().length < 2) {
      setFormErrors((prev) => ({
        ...prev,
        lastName: "Last name must be at least 2 characters",
      }));
      return false;
    }

    if (name.includes(" ")) {
      setFormErrors((prev) => ({
        ...prev,
        lastName: "First name cannot contain spaces",
      }));
      return false;
    }

    if (!/^[a-zA-Z\s-']+$/.test(name)) {
      setFormErrors((prev) => ({
        ...prev,
        lastName:
          "Last name can only contain letters, spaces, hyphens and apostrophes",
      }));
      return false;
    }

    setFormErrors((prev) => ({ ...prev, lastName: "" }));
    return true;
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      setFormErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setFormErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      return false;
    }

    setFormErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validatePhone = (phone: string) => {
    if (!phone) {
      setFormErrors((prev) => ({ ...prev, phone: "" }));
      return true;
    }

    // Basic phone validation (allows various formats)
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex?.test(phone)) {
      setFormErrors((prev) => ({
        ...prev,
        phone: "Please enter a valid phone number",
      }));
      return false;
    }

    setFormErrors((prev) => ({ ...prev, phone: "" }));
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear error when typing
    setFormErrors((prev) => ({ ...prev, [id]: "" }));
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setFormErrors((prev) => ({
          ...prev,
          profile_image: "Only JPG, PNG and GIF images are allowed",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,
          profile_image: "Image size should be less than 5MB",
        }));
        return;
      }

      // Update form data with file
      setFormData((prev) => ({ ...prev, profile_image: file }));

      // Create and set preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Clear any previous errors
      setFormErrors((prev) => ({ ...prev, profile_image: "" }));
    }
  };

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "firstName":
        return validateFirstName(value);
      case "lastName":
        return validateLastName(value);
      case "email":
        return validateEmail(value);
      case "phone":
        return validatePhone(value);
      default:
        return true;
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    validateField(id, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const isFirstNameValid = validateFirstName(formData.firstName);
    const isLastNameValid = validateLastName(formData.lastName);
    const isEmailValid = validateEmail(formData.email);
    const isPhoneValid = validatePhone(formData.phone);

    if (isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid) {
      try {
        // Create FormData for multipart/form-data submission
        const submitData = new FormData();
        submitData.append("firstName", formData.firstName);
        submitData.append("lastName", formData.lastName);
        submitData.append("email", formData.email);
        submitData.append("phone", formData.phone || "");

        // Only append image if a new one is selected
        if (formData.profile_image) {
          submitData.append("profile_image", formData.profile_image);
        }

        // Dispatch update action with formData and user ID
        await dispatch(
          updateUserProfile({
            formData: submitData,
            userId: userData?._id || "",
          })
        )
          .unwrap()
          .then((response) => {
            if (response?.success) {
              setIsEditProfileOpen(false);
              toast.success("Profile updated successfully");
            } else {
              toast.error("Failed to update profile. Please try again.");
            }
          });
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again.");
      }
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  // Function to trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="font-Outfit bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-pink-900 to-pink-500 py-24 px-6 relative overflow-hidden">
        <div className="container mx-auto flex items-center justify-between relative z-10">
          <div className="text-white">
            <h1 className="text-3xl font-bold">Personal Information</h1>
            <p className="text-indigo-100 mt-2">
              View and manage your account details
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
              {userData?.profile_image || session?.user?.image ? (
                <img
                  src={userData.profile_image || session?.user?.image}
                  alt="Profile"
                  className="h-12 w-12 md:h-20 md:w-20 rounded-full object-cover"
                />
              ) : (
                <User size={32} className="text-white" />
              )}
            </div>
          </div>
        </div>
        {/* Abstract shapes for visual appeal */}
        <div className="absolute -bottom-8 left-0 w-full h-32 bg-gray-50 rounded-t-[50%] transform translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full -mr-32 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/20 rounded-full -ml-20 -mb-20"></div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 relative -mt-12">
        <div className="lg:flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-1/5 sticky top-16 h-fit">
            <div className="bg-white shadow-sm rounded-xl p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                My Account
              </h2>
              <nav>
                <ul className="space-y-1">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link href={item.href}>
                        <div
                          className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                            item.active
                              ? "bg-indigo-50 text-pink-700"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={
                                item.active ? "text-pink-600" : "text-gray-500"
                              }
                            >
                              {item.icon}
                            </span>
                            <span className="font-medium">{item.label}</span>
                          </div>
                          {item.active && (
                            <ChevronRight size={16} className="text-pink-600" />
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                  <li className="pt-4 mt-4 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Log Out</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main Dashboard Content */}
          <div className="flex-1 space-y-6 mb-10">
            {/* Mobile Navigation */}
            <div className="lg:hidden bg-white shadow-sm rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Personal Info
                </h2>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="bg-indigo-100 rounded-full p-2">
                  {userData?.profile_image || session?.user?.image ? (
                    <img
                      src={userData.profile_image || session?.user?.image}
                      alt="Profile"
                      className="h-12 w-12 md:h-20 md:w-20 rounded-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-pink-700" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {userData?.name || "User"} {userData?.last_name || ""}
                  </h3>
                  <p className="text-gray-500 mt-1">
                    {userData?.email || "No email provided"}
                  </p>
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => setIsEditProfileOpen(true)}
                      className="inline-flex items-center gap-1 text-sm font-medium text-pink-600 hover:text-pink-800 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors"
                    >
                      <Edit size={16} /> Edit Profile
                    </button>
                    {session?.user?.image?.includes(
                      "lh3.googleusercontent.com"
                    ) ? null : (
                      <button
                        onClick={handleResetPassword}
                        className="text-indigo-600 font-medium flex items-center hover:text-indigo-800 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors text-sm"
                      >
                        <Settings size={16} /> Change Password
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Account Details
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm">First Name</p>
                  <p className="font-medium text-gray-800">
                    {userData?.name || "Not provided"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm">Last Name</p>
                  <p className="font-medium text-gray-800">
                    {userData?.last_name || "Not provided"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm">Email Address</p>
                  <p className="font-medium text-gray-800">
                    {userData?.email || "Not provided"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm">Phone Number</p>
                  <p className="font-medium text-gray-800">
                    {userData?.phone || "Not provided"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm">Member Since</p>
                  <p className="font-medium text-gray-800">
                    {formatDate(userData?.createdAt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm">Account Status</p>
                  <p className="font-medium text-gray-800">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Custom Modal for Edit Profile */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl w-full max-w-[500px] animate-fadeIn"
            style={{ animation: "fadeIn 0.2s ease-out" }}
          >
            {/* Modal Header */}
            <div className="px-6 pt-6 pb-2 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="px-6 py-6">
              <div className="space-y-5">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center mb-4">
                  <div className="relative mb-4">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="h-24 w-24 rounded-full object-cover border-2 border-pink-500"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User size={48} className="text-pink-700" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="absolute bottom-0 right-0 bg-pink-600 text-white rounded-full p-2 shadow-md hover:bg-pink-700 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    id="profile_image"
                    name="profile_image"
                    type="file"
                    accept="image/jpeg, image/png, image/jpg, image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="text-sm text-pink-600 hover:text-pink-800 font-medium"
                  >
                    Upload Profile Picture
                  </button>
                  {formErrors.profile_image && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.profile_image}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full h-10 px-3 py-2 border text-black border-${
                        formErrors.firstName ? "red-500" : "gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500`}
                      required
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full h-10 px-3 py-2 border text-black border-${
                        formErrors.lastName ? "red-500" : "gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500`}
                      required
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full h-10 px-3 py-2 border text-black border-${
                      formErrors.email ? "red-500" : "gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500`}
                    required
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full h-10 px-3 py-2 border text-black border-${
                      formErrors.phone ? "red-500" : "gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500`}
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-pink-700 border border-transparent rounded-md text-white hover:bg-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors inline-flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personal_info;
