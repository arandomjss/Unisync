// ClubUtils.tsx

import { FaRegCircle } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

const defaultColors = ["bg-red-500", "bg-green-500", "bg-blue-500", "bg-pink-500", "bg-teal-500", "bg-yellow-500"];
const defaultTextColors = ["text-white", "text-black", "text-white", "text-white", "text-black", "text-black"];
const defaultIcons = [FaRegCircle, FaRegCircle, FaRegCircle, FaRegCircle, FaRegCircle, FaRegCircle];

export const useClubData = () => {
  const [clubData, setClubData] = useState({});

  useEffect(() => {
    const fetchClubs = async () => {
      const { data, error } = await supabase.from("clubs").select("id, name, description");

      if (error) {
        console.error("Error fetching clubs:", error);
      } else {
        const clubs = {};
        data.forEach((club, index) => {
          clubs[club.id] = {
            name: club.name,
            description: club.description,
            color: defaultColors[index % defaultColors.length],
            textColor: defaultTextColors[index % defaultTextColors.length],
            icon: defaultIcons[index % defaultIcons.length],
          };
        });
        setClubData(clubs);
      }
    };

    fetchClubs();
  }, []);

  return clubData;
};

// Utility functions to get club properties
export const getClubColor = (clubData, clubId) => {
  return clubData[clubId]?.color || "bg-gray-500";
};

export const getClubTextColor = (clubData, clubId) => {
  return clubData[clubId]?.textColor || "text-black";
};

export const getClubIcon = (clubData, clubId) => {
  return clubData[clubId]?.icon || FaRegCircle;
};