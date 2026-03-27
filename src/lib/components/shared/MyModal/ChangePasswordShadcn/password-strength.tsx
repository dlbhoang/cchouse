"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordRule {
  id: string;
  label: string;
  validator: (password: string) => boolean;
}

interface PasswordStrengthProps {
  password: string;
}

const passwordRules: PasswordRule[] = [
  {
    id: "length",
    label: "Tối thiểu 8 ký tự",
    validator: (password) => password.length >= 8,
  },
  {
    id: "number",
    label: "Chứa số",
    validator: (password) => /\d/.test(password),
  },
  {
    id: "special",
    label: "Chứa ký tự đặc biệt",
    validator: (password) => /[@$!%*#?&]/.test(password),
  },
  {
    id: "letter",
    label: "Chứa chữ cái",
    validator: (password) => /[A-Za-z]/.test(password),
  },
];

export function PasswordStrength({ password }: PasswordStrengthProps) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground">
        Mật khẩu phải đáp ứng các yêu cầu sau:
      </div>
      <div className="space-y-1">
        {passwordRules.map((rule) => {
          const isRuleValid = rule.validator(password);
          return (
            <div
              key={rule.id}
              className={cn(
                "flex items-center gap-2 text-sm transition-colors",
                isRuleValid
                  ? "text-green-600 dark:text-green-400"
                  : "text-muted-foreground"
              )}
            >
              {isRuleValid ? (
                <Check className="h-4 w-4 flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 flex-shrink-0" />
              )}
              <span>{rule.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
