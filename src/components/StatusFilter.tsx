"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Constants
import { statuses, getStatusIcon } from "@/constants/statuses";

// 3rd party
import { IoIosCheckmark } from "react-icons/io";

export default function StatusFilter({
  currentStatus,
}: {
  currentStatus: string | undefined;
}) {
  const searchParams = useSearchParams();

  return (
    <div className="relative w-full">
      <p className="font-semibold text-xl mb-4">Status</p>
      <div className="space-y-4">
        {statuses.map(({ status }) => {
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.set("status", status);
          newParams.set("page", "1");

          const StatusIcon = getStatusIcon(status);

          // Define colors statically
          let statusIconColor = "";

          if (status === "TODO") {
            statusIconColor = "text-primary";
          } else if (status === "SOLVED") {
            statusIconColor = "text-emerald-700";
          } else if (status === "ATTEMPTED") {
            statusIconColor = "text-orange-600";
          }

          return (
            <Link
              key={status}
              href={`?${newParams.toString()}`}
              className="flex items-center cursor-pointer hover:underline rounded-custom"
            >
              {currentStatus === status ? (
                <span className="relative w-5 h-5 bg-primary text-white rounded-custom mr-4">
                  <IoIosCheckmark className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl" />
                </span>
              ) : (
                <span className="w-5 h-5 border rounded-custom mr-4"></span>
              )}

              <span className="capitalize">
                {status.charAt(0) + status.substring(1).toLocaleLowerCase()}
              </span>

              {StatusIcon && (
                <StatusIcon className={`text-xl ml-2 ${statusIconColor}`} />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
