import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { userId, hashedPassword } = req.body;

    if (!userId || !hashedPassword) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const { error } = await supabase
            .from("users")
            .update({ password_hash: hashedPassword })
            .eq("id", userId);

        if (error) {
            console.error("Error updating password hash:", error);
            return res.status(500).json({ error: "Failed to update password hash" });
        }

        return res.status(200).json({ message: "Password hash updated successfully" });
    } catch (err) {
        console.error("Unexpected error:", err);
        return res.status(500).json({ error: "Unexpected error occurred" });
    }
}