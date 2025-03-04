import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/lib/supabase";
import { WebhookEvent } from "@clerk/nextjs/server";

// Clerk Webhook: create or delete a user in the database by Clerk ID
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("Received POST request at /api/webhooks/clerk");
    const evt = req.body as WebhookEvent;
    console.log("Parsed webhook event:", evt);

    const {
      id: clerkUserId,
      email_addresses,
      first_name,
      last_name,
    } = evt.data as {
      id: string;
      email_addresses: { email_address: string }[];
      first_name: string;
      last_name: string;
    };
    const email = email_addresses?.[0]?.email_address;
    console.log("Extracted user data:", {
      clerkUserId,
      email,
      first_name,
      last_name,
    });

    if (!clerkUserId) {
      console.error("No user ID provided");
      return res.status(400).json({ error: "No user ID provided" });
    }

    if (!email) {
      console.error("No email provided");
      return res.status(400).json({ error: "No email provided" });
    }

    let user = null;

    switch (evt.type) {
      case "user.created": {
        console.log("Upserting user with ID:", clerkUserId);
        const { data, error } = await supabase.from("user").upsert(
          [
            {
              clerk_user_id: clerkUserId,
              email,
              first_name,
              last_name,
              role: 'USER'
            },
          ],
          {
            onConflict: "clerk_user_id",
          }
        );

        if (error) {
          console.error("Error inserting/updating user:", error);
          return res
            .status(500)
            .json({ error: "Error inserting/updating user" });
        }

        console.log("User inserted/updated successfully:", data);
        user = data;
        break;
      }

      case "user.deleted": {
        console.log("Deleting user with ID:", clerkUserId);
        const { error } = await supabase
          .from("user")
          .delete()
          .eq("clerk_user_id", clerkUserId);

        if (error) {
          console.error("Error deleting user:", error);
          return res.status(500).json({ error: "Error deleting user" });
        }

        console.log("User deleted successfully");
        user = { clerkUserId, deleted: true };
        break;
      }

      default:
        console.error("Unhandled event type:", evt.type);
        return res.status(400).json({ error: "Unhandled event type" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
