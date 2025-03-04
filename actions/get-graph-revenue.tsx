// You can adjust the path according to your project structure
// import supabase from "@/lib/supabase";

export const getGraphRevenue = async () => {
  // Fake data simulating the structure returned by Supabase
  const paidOrders = [
    {
      id: "order1",
      createdat: "2024-01-15T10:00:00Z",
      orderitem: [
        {
          id: "item1",
          productid: "product1",
          product: {
            id: "product1",
            price: 15,
          },
        },
        {
          id: "item2",
          productid: "product2",
          product: {
            id: "product2",
            price: 21,
          },
        },
      ],
    },
    {
      id: "order2",
      createdat: "2024-02-20T12:00:00Z",
      orderitem: [
        {
          id: "item3",
          productid: "product3",
          product: {
            id: "product3",
            price: 60,
          },
        },
      ],
    },
    {
      id: "order3",
      createdat: "2024-03-25T14:00:00Z",
      orderitem: [
        {
          id: "item4",
          productid: "product4",
          product: {
            id: "product4",
            price: 30,
          },
        },
        {
          id: "item5",
          productid: "product5",
          product: {
            id: "product5",
            price: 45,
          },
        },
      ],
    },
  ];

  // Calculate monthly revenue
  const monthlyRevenue: any = {};

  for (const order of paidOrders) {
    const month = new Date(order.createdat).getMonth(); // Convert timestamp to Date object and get month
    let revenueForOrder = 0;

    for (const item of order.orderitem as any) {
      revenueForOrder += item.product.price;
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }

  // Prepare graph data
  const graphData = [
    { name: "Enero", total: 0 },
    { name: "Febrero", total: 0 },
    { name: "Marzo", total: 0 },
    { name: "Abril", total: 0 },
    { name: "Mayo", total: 0 },
    { name: "Junio", total: 0 },
    { name: "Julio", total: 0 },
    { name: "Agosto", total: 0 },
    { name: "Septiembre", total: 0 },
    { name: "Octubre", total: 0 },
    { name: "Noviembre", total: 0 },
    { name: "Diciembre", total: 0 },
  ];

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }

  return graphData;
};
