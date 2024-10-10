"use client";

import { Button } from "@nextui-org/button";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <div className="inset-0 flex items-center h-screen -mt-28 justify-center">
      <div className="text-center">
        <X className="w-12 h-12 mb-4 mx-auto" color="danger" />
        <h1>Something Bad Happened</h1>
        <Button color="primary" variant="bordered" onClick={() => reset()}>
          Retry
        </Button>
      </div>
    </div>
  );
}
