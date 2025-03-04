import { useState } from "react";

const ApproverTree = ({ approvers, invoice }) => {
  const [selectedApprovers, setSelectedApprovers] = useState({});

  // Function to add a selected approver under an invoice
  const handleSelectApprover = (approverId, parentId = null) => {
    setSelectedApprovers((prev) => {
      const newSelected = { ...prev };
      
      if (!newSelected[invoice.id]) {
        newSelected[invoice.id] = [];
      }

      newSelected[invoice.id].push({ id: approverId, parentId });
      return newSelected;
    });
  };

  // Function to remove a selected approver
  const handleRemoveApprover = (approverId) => {
    setSelectedApprovers((prev) => {
      const newSelected = { ...prev };
      newSelected[invoice.id] = newSelected[invoice.id].filter(a => a.id !== approverId);
      return newSelected;
    });
  };

  // Get available approvers (filter out selected ones)
  const availableApprovers = approvers.filter(
    (a) => !selectedApprovers[invoice.id]?.some((s) => s.id === a.id)
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700">Select Approver:</label>
        <select
          onChange={(e) => {
            const selectedId = e.target.value;
            if (selectedId) handleSelectApprover(selectedId);
          }}
          className="border p-2 rounded"
        >
          <option value="">Select</option>
          {availableApprovers.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Display Selected Approvers in Tree Structure */}
      <div className="space-y-2">
        {selectedApprovers[invoice.id]?.map((approver, index) => (
          <div key={approver.id} className="ml-4 border-l pl-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{approvers.find((a) => a.id === approver.id)?.name}</span>
              
              {/* Sub-approver dropdown */}
              <select
                onChange={(e) => {
                  const subApproverId = e.target.value;
                  if (subApproverId) handleSelectApprover(subApproverId, approver.id);
                }}
                className="border p-1 rounded"
              >
                <option value="">Add Sub Approver</option>
                {availableApprovers.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveApprover(approver.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>

            {/* Render Nested Approvers */}
            {selectedApprovers[invoice.id]?.filter(a => a.parentId === approver.id).length > 0 && (
              <div className="ml-6 border-l pl-4">
                {selectedApprovers[invoice.id]
                  .filter((a) => a.parentId === approver.id)
                  .map((subApprover) => (
                    <div key={subApprover.id} className="flex items-center space-x-4">
                      <span className="text-gray-700">{approvers.find((a) => a.id === subApprover.id)?.name}</span>
                      <button
                        onClick={() => handleRemoveApprover(subApprover.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApproverTree;
