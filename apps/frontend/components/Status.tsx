import React from "react";

function Status({
  status,
  onClick
}: {
  status: "assigned" | "submitted" | "reassigned" | "completed" | "inprogress";
  onClick?: () => void;
}) {

  let color = "";
  console.log(status)
  if (status === "inprogress"){
    color = "bg-yellow-100 text-yellow-800"
  } else if (status === "completed"){
    color = "bg-green-100 text-green-800"
  } else if (status === "assigned"){
    color = "bg-orange-100 text-orange-800"
  } else if (status === "reassigned") {
    color = "bg-red-100 text-red-800"
  } else if (status === "submitted") {
    color = "bg-blue-100 text-blue-800"
  }
  return (
    <span
      className={`ml-2 text-xs px-2 py-0.5 rounded-full ${color}`}
      onClick={onClick}
    >
      {status}
    </span>
  );
}

export default Status;
