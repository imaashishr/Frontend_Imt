import React, { useState } from "react";
import Sidebar from "../../template/Sidebar";

const Ocr = ({ user }) => {
  const [ocrResult, setOcrResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);

  console.log("vfdbfgdfhdw", invoiceData);
  

  const parseInvoiceData = (text) => {
    const invoice = {
      invoiceNumber: "",
      billedTo: "",
      companyDetails: "",
      items: [],
      subtotal: "",
      tax: "",
      total: "",
    };

    const lines = text.split("\n");
    let isItemSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith("Invoice #:")) {
        invoice.invoiceNumber = line.split(":")[1].trim();
      } else if (line.startsWith("Billed To:")) {
        invoice.billedTo = lines[i + 2].trim();
      } else if (line.startsWith("Company Details:")) {
        invoice.companyDetails = lines[i + 2].trim();
      } else if (line.startsWith("Subtotal:")) {
        invoice.subtotal = lines[i+1].trim();
      } else if (line.startsWith("Tax (")) {
        invoice.tax = lines[i+1].trim();
      } else if (line.startsWith("Total:")) {
        invoice.total = lines[i+1].trim();
      } else if (line.startsWith("Item Code")) {
        isItemSection = true;
      } else if (isItemSection && line) {
        const itemParts = line.split(/\s{2,}/);
        if (itemParts.length >= 5) {
          invoice.items.push({
            itemCode: itemParts[0],
            description: itemParts[1],
            orderedQuantity: itemParts[2],
            deliveredQuantity: itemParts[3],
            rate: itemParts[4],
            total: itemParts[5],
          });
        }
      } else if (isItemSection && !line) {
        isItemSection = false;
      }
    }

    return invoice;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    setLoading(true);
    setError("");
    setOcrResult(null);
    setInvoiceData(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:4000/api/ocr/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to process PDF.");
      }

      setOcrResult(result.extractedText);
      const parsedData = parseInvoiceData(result.extractedText);
      setInvoiceData(parsedData);
    } catch (err) {
      console.error("OCR Error:", err);
      setError("An error occurred during OCR processing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar user={user} />

      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="container mx-auto max-w-5xl bg-white p-8 shadow-lg rounded-lg">
          <div className="text-center border-b pb-6 mb-6">
            <h1 className="text-4xl font-bold text-[#3B71CA]">OCR</h1>
            <p className="text-gray-600 mt-2">Upload a PDF to extract text</p>
          </div>

          <div className="flex justify-center mb-6">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              id="pdf-upload"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="pdf-upload"
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
            >
              Upload PDF
            </label>
          </div>

          {loading && (
            <div className="text-center text-blue-600 font-semibold">Processing PDF...</div>
          )}

          {error && <div className="text-center text-red-600">{error}</div>}

          {ocrResult && (
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg mt-6">
              <h2 className="text-2xl font-semibold mb-4">OCR Result</h2>
              <div className="text-gray-800 whitespace-pre-wrap">
                <p>{ocrResult}</p>
              </div>
            </div>
          )}

          {invoiceData && (
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg mt-6">
              <h2 className="text-2xl font-semibold mb-4">Invoice Details</h2>
              <div className="text-gray-800">
                <p><strong>Invoice Number:</strong> {invoiceData.invoiceNumber}</p>
                <p><strong>Billed To:</strong> {invoiceData.billedTo}</p>
                <p><strong>Company Details:</strong> {invoiceData.companyDetails}</p>
                <p><strong>Subtotal:</strong> {invoiceData.subtotal}</p>
                <p><strong>Tax:</strong> {invoiceData.tax}</p>
                <p><strong>Total:</strong> {invoiceData.total}</p>
                <h3 className="text-xl font-semibold mt-4">Items</h3>
                <div className="mt-2">
                  {invoiceData.items.map((item, index) => (
                    <div key={index} className="mb-4">
                      <p><strong>Item Code:</strong> {item.itemCode}</p>
                      <p><strong>Description:</strong> {item.description}</p>
                      <p><strong>Ordered Quantity:</strong> {item.orderedQuantity}</p>
                      <p><strong>Delivered Quantity:</strong> {item.deliveredQuantity}</p>
                      <p><strong>Rate:</strong> {item.rate}</p>
                      <p><strong>Total:</strong> {item.total}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ocr;