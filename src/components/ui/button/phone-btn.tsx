"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { maskPhone } from "@/lib/utils";

const PhoneBtn = ({ phone }: { phone: string }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  const handleClick = () => {
    if (!hasRevealed) {
      setIsRevealed(true);
      setHasRevealed(true);
    } else {
      // Make the call
      window.location.href = `tel:${phone}`;
    }
  };

  const displayText = isRevealed ? phone : maskPhone(phone);

  return (
    <Button type="button" variant="link" className="p-0" onClick={handleClick}>
      {displayText}
    </Button>
  );
};

export default PhoneBtn;
