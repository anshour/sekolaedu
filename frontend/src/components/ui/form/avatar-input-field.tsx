import { isHeicFile } from "@/utils/is-heic";
import { Box, Image } from "@chakra-ui/react";
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
        <Image
          src={previewUrl}
          w="20"
          h="20"
          objectPosition="center"
          objectFit="cover"
          alt="user avatar"
          rounded="full"
          flexShrink={0}
          onClick={() => inputRef.current?.click()}
        />
      ) : (
        <Box
          w="20"
          h="20"
          rounded="full"
          flexShrink={0}
          bgColor="gray.200"
          onClick={() => inputRef.current?.click()}
          cursor="pointer"
        />
      )}
    </>
  );
};

export default AvatarInputField;
