import React from "react";
import { NewsClient } from "./components/client";

const NewsPage = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <NewsClient />
      </div>
    </div>
  );
};

export default NewsPage;
