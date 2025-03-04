import prismadb from "@/lib/prismadb";
import supabase from "@/lib/supabase";

export const getTotalRevenue = async (storeId: string) => {
  // Fetch paid orders with related order items and products
  const { data: paidOrders, error } = await supabase
    .from("Order")
    .select(
      `
   id,
   ispaid,
   storeid,
   orderitem (
     id,
     productid,
     product (
       id,
       price
     )
   )
 `
    )
    .eq("storeid", storeId)
    .eq("ispaid", true);

  if (error) {
    console.error("Error fetching paid orders:", error);
    return 0; // Handle the error appropriately in your application
  }

  // Calculate total revenue
  const totalRevenue = paidOrders.reduce((total: any, order: any) => {
    const orderTotal = order.orderItems.reduce((orderSum: any, item: any) => {
      return orderSum + item.product.price;
    }, 0);

    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
