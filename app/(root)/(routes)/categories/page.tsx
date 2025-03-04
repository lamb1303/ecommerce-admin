import React from "react";
import { CategoryClient } from "./components/client";

const CategoriesPage = async () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient />
      </div>
    </div>
  );
};

export default CategoriesPage;
