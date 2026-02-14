"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/Button";

export default function ManagePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from("clubs").select("*"); // Replace "clubs" with the correct table name if needed

      if (error) {
        console.error("Error fetching items. Ensure the table name is correct and exists in the database:", error);
      } else {
        setItems(data || []);
      }
    };

    fetchItems();
  }, []);

  const handleDeleteItem = async (itemId) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const { error } = await supabase.from("clubs").delete().eq("id", itemId); // Updated to use the `clubs` table

      if (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item. Please try again.");
      } else {
        alert("Item deleted successfully!");
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      }
    }
  };

  return (
    <main className="min-h-screen bg-background p-6 pt-24">
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-6">Manage Items</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="p-6 glass-card">
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">{item.name}</h2>
            <Button
              onClick={() => handleDeleteItem(item.id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
            >
              Delete Item
            </Button>
          </div>
        ))}
      </div>
    </main>
  );
}