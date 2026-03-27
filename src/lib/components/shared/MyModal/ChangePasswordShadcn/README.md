# Change Password Modal (ShadcnUI)

A modern Change Password modal component built with ShadcnUI, react-hook-form, and Zod validation.

## Features

- ✨ Modern UI with ShadcnUI components
- 🔒 Password visibility toggle for all password fields
- ✅ Form validation with Zod schema
- 🎯 Type-safe with TypeScript
- 📱 Responsive design
- 🔄 Loading states
- 🚫 Form reset on close
- 📊 **Real-time password strength indicator**
- ✅ **Visual feedback for password requirements**

## Password Strength Indicator

The modal includes a real-time password strength indicator that shows:

- ✅ **Minimum 8 characters** - Visual checkmark when met
- ✅ **Contains numbers** - Visual checkmark when met
- ✅ **Contains special characters** - Visual checkmark when met
- ✅ **Contains letters** - Visual checkmark when met
- 📊 **Strength bar** - Color-coded progress bar (red/yellow/green)
- 📝 **Strength label** - Shows "Weak", "Medium", or "Strong"

The indicator appears below the new password field and updates in real-time as the user types.

## Usage

```tsx
import { useState } from "react";
import { ChangePasswordModal } from "@/lib/components/shared/MyModal/ChangePasswordShadcn";

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Change Password</button>

      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
```

## Props

| Prop      | Type         | Required | Description                                   |
| --------- | ------------ | -------- | --------------------------------------------- |
| `isOpen`  | `boolean`    | Yes      | Controls the visibility of the modal          |
| `onClose` | `() => void` | Yes      | Callback function called when modal is closed |

## Validation Rules

- **Old Password**: Required field
- **New Password**:
  - Minimum 8 characters
  - Must contain letters, numbers, and special characters
  - Pattern: `/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/`
- **Confirm Password**: Must match the new password

## Password Requirements

The password strength indicator validates these specific rules:

1. **Length**: Minimum 8 characters
2. **Numbers**: Must contain at least one digit
3. **Special Characters**: Must contain at least one special character (`@$!%*#?&`)
4. **Letters**: Must contain at least one letter (uppercase or lowercase)

## Dependencies

- `react-hook-form` - Form handling
- `@hookform/resolvers/zod` - Zod validation resolver
- `zod` - Schema validation
- `lucide-react` - Icons
- ShadcnUI components:
  - `Dialog`
  - `Button`
  - `Input`
  - `Form`

## API Integration

The modal uses the existing `authApi.changePassword()` function from `@/pages/api/auth/authApi` to submit the password change request.
