"use client";
import { CheckIcon, LinkIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const CopyButton = ({
  id,
  onCopy,
}: {
  id: string;
  onCopy: () => void | Promise<void>;
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = async () => {
    if (isCopied) return;

    await onCopy();
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Button
      size="icon-sm"
      variant="ghost"
      id={id}
      onClick={handleCopy}
      disabled={isCopied}
      title={isCopied ? "Đã sao chép" : "Sao chép"}
    >
      {isCopied ? (
        <CheckIcon className="size-4 text-blue-400" />
      ) : (
        <LinkIcon className="size-4" />
      )}
    </Button>
  );
};

export default CopyButton;
