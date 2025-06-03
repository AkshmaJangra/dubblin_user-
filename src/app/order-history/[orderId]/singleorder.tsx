"use client";
import {
  Package,
  User,
  MapPin,
  CreditCard,
  Clock,
  FileText,
  Truck,
  CheckCircle,
  ShoppingBag,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from "moment";

const Singleorder = ({ orderDetails }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  
// Helper function to calculate subtotal
const calculateSubtotal = () => {
  if (!orderDetails?.products || orderDetails.products.length === 0) {
    return 0;
  }
  return orderDetails.products.reduce((total, product) => {
    return total + (product.totalAmount * product.quantity);
  }, 0);
};

const handleDownloadInvoice = async () => {
  try {
    // Create a temporary div to render the invoice
    const invoiceContainer = document.createElement("div");
    invoiceContainer.style.padding = "0";
    invoiceContainer.style.position = "absolute";
    invoiceContainer.style.top = "-9999px";
    invoiceContainer.style.left = "-9999px";
    invoiceContainer.style.width = "800px";

    // Generate invoice HTML content with stylish design
    invoiceContainer.innerHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Invoice</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        body { 
          margin: 0; 
          padding: 0; 
          font-family: 'Poppins', sans-serif;
          color: #333333;
          background-color: #fff;
        }
        .invoice-container { 
          padding: 0; 
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          border-radius: 12px;
          overflow: hidden;
        }
        .header-gradient {
          background: #f8f8f8;
          color: black;
          padding: 25px 30px;
          position: relative;
          overflow: hidden;
        }
        .header-gradient::before {
          content: "";
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 200%;
          background: rgba(255,255,255,0.1);
          transform: rotate(30deg);
        }
        .header-gradient::after {
          content: "";
          position: absolute;
          bottom: -50%;
          left: -50%;
          width: 100%;
          height: 200%;
          background: rgba(0,0,0,0.05);
          transform: rotate(30deg);
        }
        .invoice-title {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 1px;
          margin: 0;
          position: relative;
          z-index: 1;
        }
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 12px;
          padding-bottom: 5px;
          border-bottom: 2px solid #000000;
          display: inline-block;
        }
        .address-card {
          background: #f8f8f8;
          border-radius: 8px;
          padding: 15px;
          height: 100%;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          border-left: 3px solid #000000;
        }
        table {
          border-collapse: separate;
          border-spacing: 0;
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        th {
          background: #000000;
          color: white;
          font-weight: 500;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
          padding: 12px 15px;
        }
        td {
          padding: 12px 15px;
          border-bottom: 1px solid #e2e2e2;
          font-size: 14px;
        }
        tr:last-child td {
          border-bottom: none;
        }
        tr:nth-child(even) {
          background-color: #f8f8f8;
        }
        .totals-card {
          background: #f8f8f8;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          border: 1px solid #e2e2e2;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px dashed #c0c0c0;
        }
        .total-row:last-child {
          border-bottom: none;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 2px solid #000000;
        }
        .total-row:last-child .total-value {
          color: #000000;
          font-size: 18px;
          font-weight: 700;
        }
        .footer {
          background: #f8f8f8;
          padding: 20px;
          text-align: center;
          border-top: 1px solid #e2e2e2;
        }
        .thank-you {
          font-size: 18px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 5px;
        }
        .logo-container {
          display: flex;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .logo-container img {
          height: 60px;
          width: auto;
          margin-right: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          background: rgba(255,255,255,0.2);
          margin-top: 5px;
        }
        .status-badge {
          display: inline-block;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          background-color: #000000;
          color: white;
        }
        .info-section {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }
        .info-column {
          flex: 1;
          min-width: 250px;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container max-w-7xl mx-auto">
        <!-- Stylish Header -->
        <div class="header-gradient">
          <div style="display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 2;">
            <div class="logo-container">
              <img src="https://www.ikii.in/image/cache/catalog/dubblin%202-600x315w.png" alt="Dubblin" style="height: 60px; width: auto;">
              <div>
                <h1 class="invoice-title">INVOICE</h1>
                <div class="badge">${moment(orderDetails?.createdAt).format("MMMM Do YYYY")}</div>
              </div>
            </div>
            <div style="text-align: right;">
              <div class="status-badge">${orderDetails?.orderStatus || "Processed"}</div>
              <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Invoice #${orderDetails?.orderId}</p>
            </div>
          </div>
        </div>
        
        <!-- Company Info -->
        <div style="background-color: #f8f8f8; padding: 15px 30px; border-bottom: 1px solid #e2e2e2;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p style="margin: 0; font-size: 14px;">Plot No 568, Udyog Vihar, Phase-5</p>
              <p style="margin: 3px 0 0; font-size: 14px;">Gurgaon Hr 122016, India</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-size: 14px;">+91 7838388836</p>
              <p style="margin: 3px 0 0; font-size: 14px;">dubblinofficial@gmail.com</p>
            </div>
          </div>
        </div>

        <!-- Customer Info Section - THREE COLUMNS LAYOUT -->
        <div style="padding: 20px 30px;">
          <div class="info-section">
            <!-- Bill To Information -->
            <div class="info-column">
              <h4 class="section-title">BILL TO</h4>
              <div class="address-card">
                <p style="font-weight: 600; margin: 0 0 8px; font-size: 16px;">${orderDetails?.billingAddress?.firstname || orderDetails?.user?.name}
                    ${orderDetails?.billingAddress?.lastname || orderDetails?.user?.last_name}</p>
                <p style="margin: 4px 0; font-size: 14px;">${orderDetails?.billingAddress?.phone || orderDetails?.shippingAddress?.phone}</p>
                <p style="margin: 4px 0; font-size: 14px;">${orderDetails?.billingAddress?.address1 ||orderDetails?.shippingAddress?.address1 }</p>
                <p style="margin: 4px 0; font-size: 14px;">${orderDetails?.billingAddress?.address2 ||orderDetails?.shippingAddress?.address2 }</p>
                <p style="margin: 4px 0; font-size: 14px;">${orderDetails?.billingAddress?.state?.name || ""} ${orderDetails?.billingAddress?.country?.name || ""} ${orderDetails?.billingAddress?.pincode || ""}</p>
                <p style="margin: 12px 0 4px; font-size: 14px;">✉️ ${orderDetails?.user?.email || ""}</p>
              </div>
            </div>

            <!-- Ship To Information -->
            <div class="info-column">
              <h4 class="section-title">SHIP TO</h4>
              <div class="address-card">
                <p style="font-weight: 600; margin: 0 0 8px; font-size: 16px;">${orderDetails?.user?.name || ""}
                    ${orderDetails?.user?.last_name || ""}</p>
                <p style="margin: 4px 0; font-size: 14px;">${orderDetails?.shippingAddress?.phone || ""}</p>
                <p style="margin: 4px 0; font-size: 14px;">${orderDetails?.shippingAddress?.address1 || ""}</p>
                <p style="margin: 4px 0; font-size: 14px;">${orderDetails?.shippingAddress?.address2 || ""}</p>
                <p style="margin: 4px 0; font-size: 14px;">${orderDetails?.shippingAddress?.state?.name || ""} ${orderDetails?.shippingAddress?.country?.name || ""} ${orderDetails?.shippingAddress?.pincode || ""}</p>
              </div>
            </div>

            <!-- Invoice Information -->
            <div class="info-column">
              <h4 class="section-title">PAYMENT INFO</h4>
              <div class="address-card">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-size: 14px;">Transaction ID:</span>
                  <span style="font-size: 14px; font-weight: 500; word-break: break-word;">${orderDetails?.transactionId || ""}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-size: 14px;">Payment Date:</span>
                  <span style="font-size: 14px; font-weight: 500;">${moment(orderDetails?.createdAt).format("MMM DD, YYYY")}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-size: 14px;">Payment Method:</span>
                  <span style="font-size: 14px; font-weight: 500;">Online</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px dashed #c0c0c0;">
                  <span style="font-size: 14px; font-weight: 600;">Amount Paid:</span>
                  <span style="font-size: 16px; font-weight: 700; color: #000000;">₹ ${(orderDetails?.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Invoice Table -->
        <div style="padding: 0 30px 30px;">
          <h4 class="section-title">ORDER DETAILS</h4>
          <table style="width: 100%;">
            <thead>
              <tr>
                <th style="text-align: left;">Item</th>
                <th style="text-align: center; width: 80px;">Qty</th>
                <th style="text-align: right; width: 120px;">Price</th>
                <th style="text-align: right; width: 120px;">Total</th>
              </tr>
            </thead>
            <tbody>
            ${orderDetails?.products
              ?.map((product, index) => {
                const price = product?.totalAmount || 0;
                const quantity = product?.quantity || 0;
                const total = price * quantity;
                return `<tr>
                    <td style="padding: 15px; font-weight: 500;">
                      ${product?.productId?.name || "Product"}
                    </td>
                    <td style="text-align: center; font-weight: 500;">${quantity}</td>
                    <td style="text-align: right;">₹ ${price.toFixed(2)}</td>
                    <td style="text-align: right; font-weight: 600;">₹ ${total.toFixed(2)}</td>
                  </tr>`
              })
              .join("") || ""}
            </tbody>
          </table>
          
          <!-- Totals Section -->
          <div style="display: flex; justify-content: flex-end; margin-top: 30px;">
            <div class="totals-card" style="width: 300px;">
              <div class="total-row">
                <span>Subtotal:</span>
                <span class="total-value">₹ ${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Tax:</span>
                <span class="total-value">₹ ${(orderDetails?.tax || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Shipping:</span>
                <span class="total-value">₹ ${(orderDetails?.shippingCharges || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span style="font-weight: 600;">Total Amount:</span>
                <span class="total-value">₹ ${orderDetails?.totalAmount ? orderDetails.totalAmount.toFixed(2) : "0.00"}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p class="thank-you">Thank you for your business!</p>
          <p style="margin: 5px 0 0; font-size: 13px; color: #666666;">
            If you have any questions about this invoice, please contact us at
            <span style="color: #000000; font-weight: 500;">dubblinofficial@gmail.com</span>
          </p>
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #c0c0c0;">
            <p style="margin: 0; font-size: 12px; color: #888888;">Dubblin © ${new Date().getFullYear()} • All Rights Reserved</p>
          </div>
        </div>
      </div>
    </body>
    </html>`;

    // Add the invoice container to the document
    document.body.appendChild(invoiceContainer);

    // Wait a moment for styles to apply
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Capture the invoice as an image
    const canvas = await html2canvas(invoiceContainer, {
      scale: 2, // Higher quality rendering
      useCORS: true, // Allow loading cross-origin images
      logging: false
    });

    // Remove the temporary container
    document.body.removeChild(invoiceContainer);

    // Create PDF with better positioning
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 5; // Reduced top margin to 5mm

    pdf.addImage(
      imgData,
      "PNG",
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio
    );
    pdf.save(`Invoice-${orderDetails?.orderId}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate invoice. Please try again.");
  }
};
  // Calculate order progress percentage based on status
  const getOrderProgress = () => {
    const statuses = [
      "pending",
      "confirm",
      "processing",
      "shipped",
      "delivered",
    ];
    const currentStatus = orderDetails?.orderStatus || "pending";
    const index = statuses.findIndex((status) =>
      currentStatus.toLowerCase().includes(status.toLowerCase())
    );
    console.log("this is order",currentStatus)
    return index >= 0 ? ((index + 1) / statuses.length) * 100 : 20;
  };


  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen font-Outfit p-2 sm:p-4 md:p-6 lg:p-10">
      <div className="w-full max-w-7xl mx-auto bg-white border border-slate-200 overflow-hidden rounded-xl shadow-md">
        {/* Order Header */}
        <div className="bg-gradient-to-r from-pink-900 to-pink-700 p-4 sm:p-6 md:p-8 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <h1 className="text-xl sm:text-2xl font-bold">
                  Order #{orderDetails?.orderId}
                </h1>
              </div>
              <button
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-sm"
                onClick={handleDownloadInvoice}
              >
                <FileText className="h-4 w-4" />
                Download Invoice
              </button>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Clock className="h-4 w-4" />
              <p className="text-sm">{formatDate(orderDetails?.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Order Content */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* Order Items */}
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-slate-600" />
            Order Items
          </h2>

          <div className="space-y-4">
            {orderDetails?.products?.map((product) => (
              <div
                key={product?._id}
                className="border border-slate-200 rounded-lg bg-white p-4 sm:p-6 transition-all hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                    <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-center h-full">
                      <img
                        src={product?.product?.main_image || "/placeholder.svg"}
                        alt={product?.productId?.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-slate-800">
                      {product?.productId?.name}
                    </h3>
                    {product?.variantId?.values?.map((item) => (
                      <span
                        key={item?._id}
                        className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded mr-2 mt-1"
                      >
                        {item?.full_name}
                      </span>
                    ))}
                  </div>

                  <div className="text-center sm:text-right">
                    <div className="text-slate-500 text-sm">Quantity</div>
                    <div className="font-medium text-slate-800">
                      {product?.quantity}
                    </div>
                    <div className="mt-2 text-slate-500 text-sm">Price</div>
                    <div className="font-medium text-slate-800">
                      ₹{product?.totalAmount}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Status */}
          <div className="mt-10 mb-8">
            {orderDetails?.orderStatus?.toLowerCase() === "cancelled" ? (
              <div className="relative mb-8 font-semibold">
                {/* Order Status */}
                <div className="mt-10 mb-8">
                  <div className="relative mb-8">
                    <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-slate-600" />
                      Order Status
                    </h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-red-100 p-3 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-red-700">
                            Order Cancelled
                          </h4>
                          <p className="text-red-600 mt-1">
                            This order has been cancelled and will not be
                            processed.
                          </p>
                        </div>
                      </div>
                      {/* <div className="hidden sm:block">
                        <button className="text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 font-medium rounded-lg px-4 py-2 text-sm transition-colors">
                          View Details
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-slate-600" />
                  Shipping Status
                </h3>
                <div className="relative mb-8">
                  <div className="h-2 bg-slate-200 rounded-full">
                    <div
                      className="h-2 bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${getOrderProgress()}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          getOrderProgress() >= 20
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs mt-2 font-medium ${
                          getOrderProgress() >= 20
                            ? "text-emerald-600"
                            : "text-slate-500"
                        }`}
                      >
                        Order Pending
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          getOrderProgress() >= 40
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs mt-2 font-medium ${
                          getOrderProgress() >= 40
                            ? "text-emerald-600"
                            : "text-slate-500"
                        }`}
                      >
                        Order Confirm
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          getOrderProgress() >= 60
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs mt-2 font-medium ${
                          getOrderProgress() >= 60
                            ? "text-emerald-600"
                            : "text-slate-500"
                        }`}
                      >
                        Order Processing
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          getOrderProgress() >= 80
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs mt-2 font-medium ${
                          getOrderProgress() >= 80
                            ? "text-emerald-600"
                            : "text-slate-500"
                        }`}
                      >
                        Shipped
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          getOrderProgress() >= 100
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs mt-2 font-medium ${
                          getOrderProgress() >= 100
                            ? "text-emerald-600"
                            : "text-slate-500"
                        }`}
                      >
                        Delivered
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer with Address and Total */}
        <div className="bg-slate-50 p-4 sm:p-6 md:p-8 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Delivery Address */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-slate-800 font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-600" />
                Delivery Address
              </h3>
              <div className="text-slate-600 space-y-1">
                <p className="font-medium text-slate-800">
                  {orderDetails?.user?.name} {orderDetails?.user?.last_name}
                </p>
                <p className="font-medium text-slate-800">
                  {orderDetails?.shippingAddress?.phone}
                </p>
                <p>{orderDetails?.shippingAddress?.address1}</p>
                <p>{orderDetails?.shippingAddress?.address2}</p>
                <p>
                  {orderDetails?.shippingAddress?.state?.name || ""}{" "}
                  {orderDetails?.shippingAddress?.country?.name || ""}{" "}
                  {orderDetails?.shippingAddress?.pincode || ""}
                </p>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-slate-800 font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-slate-600" />
                Billing Address
              </h3>
              {orderDetails?.billingAddress ? (
                <div className="text-slate-600 space-y-1">
                  <p className="font-medium text-slate-800">
                    {orderDetails?.billingAddress?.firstname}{" "}
                    {orderDetails?.billingAddress?.lastname}
                  </p>
                  <p>{orderDetails?.billingAddress?.address1}</p>
                  <p>{orderDetails?.billingAddress?.address2}</p>
                  <p>
                    {orderDetails?.billingAddress?.state?.name}{" "}
                    {orderDetails?.billingAddress?.country?.name}{" "}
                    {orderDetails?.billingAddress?.pincode}
                  </p>
                </div>
              ) : (
                <div className="text-slate-600 space-y-1">
                  <p className="font-medium text-slate-800">
                    {orderDetails?.user?.name} {orderDetails?.user?.last_name}
                  </p>
                  <p className="font-medium text-slate-800">
                    {orderDetails?.shippingAddress?.phone}
                  </p>
                  <p>{orderDetails?.shippingAddress?.address1}</p>
                  <p>{orderDetails?.shippingAddress?.address2}</p>
                  <p>
                    {orderDetails?.shippingAddress?.state?.name || ""}{" "}
                    {orderDetails?.shippingAddress?.country?.name || ""}{" "}
                    {orderDetails?.shippingAddress?.pincode || ""}
                  </p>
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-slate-800 font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-slate-600" />
                Payment Information
              </h3>
              <div className="text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-medium text-slate-800">
                    {orderDetails?.transactionId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-medium text-slate-800">Online</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className="font-medium text-emerald-600">
                    Completed
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-slate-800">Total:</span>
                    <span className="font-bold text-slate-900">
                      ₹{orderDetails?.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Singleorder;
