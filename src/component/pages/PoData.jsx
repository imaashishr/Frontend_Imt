const poData = [
    {
      poNumber: "PO12345",
      lineItems: [
        {
          id: 1,
          code: "ITEM001",
          description: "Item Description 1",
          orderedQty: 10,
          uom: "pcs",
          rate: 100,
          deliveryDate: "2024-12-15",
          deliveredQty: 5, // Delivered Quantity
          shortClose: 5, // Short Close
          status: "Completed",
        },
        {
          id: 2,
          code: "ITEM002",
          description: "Item Description 2",
          orderedQty: 5,
          uom: "pcs",
          rate: 200,
          deliveryDate: "2024-12-20",
          deliveredQty: 5, // Delivered Quantity
          shortClose: 0, // Short Close
          status: "Completed",
        },
        {
          id: 3,
          code: "ITEM003",
          description: "Item Description 3",
          orderedQty: 15,
          uom: "pcs",
          rate: 150,
          deliveryDate: "2024-12-22",
          deliveredQty: 0, // Delivered Quantity
          shortClose: 15, // Short Close
          status: "Completed",
        },
        {
          id: 4,
          code: "ITEM004",
          description: "Item Description 4",
          orderedQty: 30,
          uom: "pcs",
          rate: 50,
          deliveryDate: "2024-12-25",
          deliveredQty: 0, // Delivered Quantity
          shortClose: 30, // Short Close
          status: "Completed",
        },
      ],
    },
    {
      poNumber: "PO12346",
      lineItems: [
        {
          id: 5,
          code: "ITEM005",
          description: "Item Description 5",
          orderedQty: 20,
          uom: "pcs",
          rate: 120,
          deliveryDate: "2024-12-18",
          deliveredQty: 10, // Delivered Quantity
          shortClose: 10, // Short Close
          status: "Active",
        },
        {
          id: 6,
          code: "ITEM006",
          description: "Item Description 6",
          orderedQty: 25,
          uom: "pcs",
          rate: 180,
          deliveryDate: "2024-12-19",
          deliveredQty: 25, // Delivered Quantity
          shortClose: 0, // Short Close
          status: "Completed",
        },
        {
          id: 7,
          code: "ITEM007",
          description: "Item Description 7",
          orderedQty: 10,
          uom: "pcs",
          rate: 350,
          deliveryDate: "2024-12-22",
          deliveredQty: 0, // Delivered Quantity
          shortClose: 10, // Short Close
          status: "Pending",
        },
        {
          id: 8,
          code: "ITEM008",
          description: "Item Description 8",
          orderedQty: 5,
          uom: "pcs",
          rate: 450,
          deliveryDate: "2024-12-23",
          deliveredQty: 3, // Delivered Quantity
          shortClose: 2, // Short Close
          status: "Active",
        },
      ],
    },
    {
      poNumber: "PO12347",
      lineItems: [
        {
          id: 9,
          code: "ITEM009",
          description: "Item Description 9",
          orderedQty: 40,
          uom: "pcs",
          rate: 80,
          deliveryDate: "2024-12-20",
          deliveredQty: 40, // Delivered Quantity
          shortClose: 0, // Short Close
          status: "Active",
        },
        {
          id: 10,
          code: "ITEM010",
          description: "Item Description 10",
          orderedQty: 30,
          uom: "pcs",
          rate: 200,
          deliveryDate: "2024-12-22",
          deliveredQty: 30, // Delivered Quantity
          shortClose: 0, // Short Close
          status: "Completed",
        },
        {
          id: 11,
          code: "ITEM011",
          description: "Item Description 11",
          orderedQty: 15,
          uom: "pcs",
          rate: 300,
          deliveryDate: "2024-12-25",
          deliveredQty: 0, // Delivered Quantity
          shortClose: 15, // Short Close
          status: "Pending",
        },
        {
          id: 12,
          code: "ITEM012",
          description: "Item Description 12",
          orderedQty: 50,
          uom: "pcs",
          rate: 120,
          deliveryDate: "2024-12-28",
          deliveredQty: 0, // Delivered Quantity
          shortClose: 50, // Short Close
          status: "Active",
        },
      ],
    },
    {
      poNumber: "PO12348",
      lineItems: [
        {
          id: 13,
          code: "ITEM013",
          description: "Item Description 13",
          orderedQty: 60,
          uom: "pcs",
          rate: 60,
          deliveryDate: "2024-12-21",
          deliveredQty: 60, // Delivered Quantity
          shortClose: 0, // Short Close
          status: "Active",
        },
        {
          id: 14,
          code: "ITEM014",
          description: "Item Description 14",
          orderedQty: 15,
          uom: "pcs",
          rate: 250,
          deliveryDate: "2024-12-24",
          deliveredQty: 15, // Delivered Quantity
          shortClose: 0, // Short Close
          status: "Completed",
        },
        {
          id: 15,
          code: "ITEM015",
          description: "Item Description 15",
          orderedQty: 10,
          uom: "pcs",
          rate: 400,
          deliveryDate: "2024-12-25",
          deliveredQty: 0, // Delivered Quantity
          shortClose: 10, // Short Close
          status: "Pending",
        },
        {
          id: 16,
          code: "ITEM016",
          description: "Item Description 16",
          orderedQty: 8,
          uom: "pcs",
          rate: 500,
          deliveryDate: "2024-12-28",
          deliveredQty: 8, // Delivered Quantity
          shortClose: 0, // Short Close
          status: "Active",
        },
        {
          id: 17,
          code: "ITEM017",
          description: "Item Description 17",
          orderedQty: 12,
          uom: "pcs",
          rate: 750,
          deliveryDate: "2024-12-29",
          deliveredQty: 12, // Delivered Quantity
          shortClose: 0, // Short Close
          status: "Completed",
        },
      ],
    },
    {
      poNumber: "PO12349",
      lineItems: [
        {
          id: 18,
          code: "ITEM018",
          description: "Item Description 18",
          orderedQty: 25,
          uom: "pcs",
          rate: 100,
          deliveryDate: "2024-12-18",
          deliveredQty: 20, // Delivered Quantity
          shortClose: 5, // Short Close
          status: "Active",
        },
        {
          id: 19,
          code: "ITEM019",
          description: "Item Description 19",
          orderedQty: 30,
          uom: "pcs",
          rate: 120,
          deliveryDate: "2024-12-19",
          deliveredQty: 30, // Delivered Quantity
          shortClose: 0, // Short Close
          status: "Completed",
        },
        {
          id: 20,
          code: "ITEM020",
          description: "Item Description 20",
          orderedQty: 10,
          uom: "pcs",
          rate: 150,
          deliveryDate: "2024-12-22",
          deliveredQty: 0, // Delivered Quantity
          shortClose: 10, // Short Close
          status: "Pending",
        },
        {
          id: 21,
          code: "ITEM021",
          description: "Item Description 21",
          orderedQty: 5,
          uom: "pcs",
          rate: 200,
          deliveryDate: "2024-12-23",
          deliveredQty: 5, // Delivered Quantity
          shortClose: 0, // Short Close
          status: "Active",
        },
        {
          id: 22,
          code: "ITEM022",
          description: "Item Description 22",
          orderedQty: 40,
          uom: "pcs",
          rate: 90,
          deliveryDate: "2024-12-25",
          deliveredQty: 40, // Delivered Quantity
          shortClose: 0, // Short Close
          status: "Completed",
        },
      ],
    },
  ];
  
  export default poData;
  