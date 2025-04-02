import React from "react";

function Status({
  status,
}: {
  status: "assigned" | "submitted" | "reassigned" | "completed";
}) {
  return (
    <span
      className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
        status === "completed"
          ? "bg-green-100 text-green-800"
          : status === "submitted"
            ? "bg-blue-100 text-blue-800"
            : status === "assigned"
              ? "bg-orange-100 text-orange-800"
              : "bg-red-100 text-red-800"
      }`}
    >
      {status}
    </span>
  );
}

export default Status;
