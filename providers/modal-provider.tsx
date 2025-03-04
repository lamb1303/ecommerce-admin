"use client";

import { useEffect, useState } from "react";
import { NewsModal } from "@/components/modals/sotre-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <NewsModal />
    </>
  );
};
