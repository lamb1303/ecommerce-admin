"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import "react-day-picker/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={es}
      showOutsideDays={showOutsideDays}
      className={cn("p-6", className)}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
