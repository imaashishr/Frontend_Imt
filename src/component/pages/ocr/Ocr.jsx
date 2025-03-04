import React, { useState } from "react";
import Sidebar from "../../template/Sidebar";
 
const Ocr = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);
 
  const parseInvoiceData = (result) => {
    const fields = result.extractedText;
    const vendorCode = fields['vendor code'];
    const invoiceDetails = fields['invoice details']?.valueArray || [];
    const supplierContact = invoiceDetails.find(detail => detail?.valueObject?.COLUMN1?.valueString?.includes('Contact Person'))?.valueObject?.COLUMN2?.valueString || 'N/A';
    const supplierContactNumber = invoiceDetails.find(detail => detail?.valueObject?.COLUMN1?.valueString?.includes('Contact No'))?.valueObject?.COLUMN2?.valueString || 'N/A';
    console.log("fields", result.extractedText);
    return {
      invoiceNumber: fields.InvoiceId?.content || "N/A",
      billedTo: fields.CustomerName?.valueString || "N/A",
      billAddress: fields.CustomerAddress?.content || "N/A",
      companyDetails: fields.VendorAddressRecipient?.valueString || "N/A",
      companyAddress: fields.VendorAddress?.content || "N/A",
      InvoiceDate: fields.InvoiceDate?.valueDate || "N/A",
      supplierContact,
      supplierContactNumber,
      IRN: vendorCode?.valueArray?.[0]?.valueObject?.COLUMN3?.valueString.split(':')[1] || "N/A",
      Ack: vendorCode?.valueArray?.[1]?.valueObject?.COLUMN2?.valueString.split(':')[1] || "N/A",
      subtotal: fields.SubTotal?.content || "N/A",
      tax: fields.TotalTax?.content || "N/A",
      total: fields.InvoiceTotal?.content || "N/A",
      items: fields.items?.valueArray?.slice(1).map(item => {
        const description = item?.valueObject?.['Product Description']?.valueString || "N/A";
        const quantity = item?.valueObject?.Qty?.content || "N/A";
        const hsn = item?.valueObject?.['HSN SAC']?.content || "N/A";
        const amount = item?.valueObject?.Amount?.content || "N/A";
        const CGST = item?.valueObject?.['CGST %']?.valueString || "N/A";
        const SGST = item?.valueObject?.['SGST %']?.valueString || "N/A";
 
        return {
          description,
          quantity,
          amount,
          hsn,
          CGST,
          SGST
        };
      }) || []
    };
  };
 
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
 
    setLoading(true);
    setError("");
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
 
      const parsedData = parseInvoiceData(result);
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
            <h1 className="text-4xl font-bold text-[#3B71CA]">Vendor Invoice Upload</h1>
            <p className="text-gray-600 mt-2">Upload a file to extract text</p>
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
              Upload
            </label>
          </div>
 
          {loading && (
            <div className="text-center text-blue-600 font-semibold">Processing...</div>
          )}
 
          {error && <div className="text-center text-red-600">{error}</div>}
 
          {invoiceData && (
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg mt-6">
              <h2 className="text-2xl font-semibold mb-4 text-center">Invoice Details</h2>
              <div className="flex justify-between">
                <div className="text-left break-words max-w-sm">
                  <p><strong>Billed To:</strong> {invoiceData.billedTo}</p>
                  <p className="ml-15">{invoiceData.billAddress}</p>
                  <br></br>
                </div>
                <div className="text-right break-words max-w-sm">
                  <p><strong>Company Details:</strong> {invoiceData.companyDetails}</p>
                  <p>{invoiceData.companyAddress}</p>
                </div>
              </div>
              <p><strong>Contact Name:</strong>{invoiceData.supplierContact}</p>
              <p><strong>Contact Number:</strong>{invoiceData.supplierContactNumber}</p>
              <p><strong>Invoice Number:</strong> {invoiceData.invoiceNumber}</p>
              <p><strong>Invoice Date:</strong> {invoiceData.InvoiceDate}</p>
              <p><strong>IRN No.:</strong><p className="max-w-sm break-words">{invoiceData.IRN}</p></p>
              <div className="text-right">
              <p><strong>ACK No.:</strong> {invoiceData.Ack}</p>
              </div>
              <h3 className="text-xl font-semibold mt-4">Items</h3>
              <div className="mt-2">
                {invoiceData.items.length > 0 && (
                  <div className="overflow-x-auto mt-4">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border px-4 py-2">Description</th>
                          <th className="border px-4 py-2">HSN SAC</th>
                          <th className="border px-4 py-2">Quantity</th>
                          <th className="border px-4 py-2">Amount</th>
                          <th className="border px-4 py-2">CGST %</th>
                          <th className="border px-4 py-2">SGST %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceData.items.map((item, index) => (
                          <tr key={index} className="text-center">
                            <td className="border px-4 py-2">{item.description}</td>
                            <td className="border px-4 py-2">{item.hsn}</td>
                            <td className="border px-4 py-2">{item.quantity}</td>
                            <td className="border px-4 py-2">{item.amount}</td>
                            <td className="border px-4 py-2">{item.CGST}</td>
                            <td className="border px-4 py-2">{item.SGST}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="text-left">
              <p><strong>Subtotal:</strong> {invoiceData.subtotal}</p>
              <p><strong>Tax:</strong> {invoiceData.tax}</p>
              <p><strong>Total:</strong> {invoiceData.total}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default Ocr;