import { InputField, InputFieldProps } from "./input-field";
import { IconButton } from "@chakra-ui/react";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

export const InputPasswordField = ({
  control,
  ...props
}: InputFieldProps<any>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputField
      control={control}
      type={showPassword ? "text" : "password"}
      w="full"
      endElement={
        <IconButton
          aria-label="See password"
          variant="ghost"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeClosed size={4} /> : <Eye size={4} />}
        </IconButton>
      }
      endElementProps={{ paddingInline: 0 }}
      endOffset="40px"
      {...props}
    />
  );
};
