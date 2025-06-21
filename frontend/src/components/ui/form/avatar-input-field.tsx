import { isHeicFile } from "@/utils/is-heic";
import { Box, Image, Icon } from "@chakra-ui/react";
import { Camera } from "lucide-react";
import React, { useRef, useState } from "react";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

interface Props<TFieldValues extends FieldValues>
  extends Pick<
    UseControllerProps<TFieldValues>,
    "rules" | "control" | "name" | "shouldUnregister"
  > {
  initialUrl?: string;
}

const AvatarInputField = <TFieldValues extends FieldValues>({
  control,
  name,
  rules,
  shouldUnregister,
  initialUrl,
  ...props
}: Props<TFieldValues>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialUrl ?? null
  );
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
    rules,
    shouldUnregister,
  });

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (file) {
      const isHeic = await isHeicFile(file);
      if (isHeic) {
        if (typeof window === "undefined") return;
        const heic2any = (await import("heic2any")).default;
        const image = await heic2any({
          blob: file,
          toType: "image/jpeg",
        });

        const blob = Array.isArray(image) ? image[0] : image;
        file = new File([blob], "profile-photo.jpeg", {
          type: "image/jpeg",
        });
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewUrl(ev.target?.result as string);
      };
      reader.onerror = () => {
        console.error("Error reading file");
        setPreviewUrl(null);
      };
      reader.readAsDataURL(file);
      field.onChange(file);
    }
  };

  return (
    <>
      <input
        hidden
        type="file"
        accept="image/*"
        onChange={handleChange}
        ref={inputRef}
      />

      {previewUrl ? (
        <Box
          position="relative"
          w="20"
          h="20"
          rounded="full"
          flexShrink={0}
          onClick={() => inputRef.current?.click()}
          cursor="pointer"
          _hover={{
            _before: {
              opacity: 1,
            },
            "& > .camera-icon": {
              opacity: 1,
            },
          }}
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "blackAlpha.600",
            borderRadius: "full",
            opacity: 0,
            transition: "opacity 0.2s ease",
            zIndex: 1,
          }}
        >
          <Image
            src={previewUrl}
            w="20"
            h="20"
            objectPosition="center"
            objectFit="cover"
            alt="user avatar"
            rounded="full"
          />
          <Icon
            as={Camera}
            className="camera-icon"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            color="white"
            boxSize="6"
            opacity={0}
            transition="opacity 0.2s ease"
            zIndex={2}
          />
        </Box>
      ) : (
        <Box
          w="20"
          h="20"
          rounded="full"
          flexShrink={0}
          bgColor="gray.200"
          onClick={() => inputRef.current?.click()}
          cursor="pointer"
          position="relative"
          display="flex"
          alignItems="center"
          justifyContent="center"
          _hover={{
            bgColor: "gray.300",
            "& > .camera-icon": {
              opacity: 1,
            },
          }}
        >
          <Icon
            as={Camera}
            className="camera-icon"
            color="gray.500"
            boxSize="6"
            opacity={0.5}
            transition="opacity 0.2s ease"
            _hover={{
              opacity: 1,
            }}
          />
        </Box>
      )}
    </>
  );
};

export default AvatarInputField;
