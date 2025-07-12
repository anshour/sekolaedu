import { ClipboardEvent } from "react";
import { UseFormSetValue, FieldArrayWithId } from "react-hook-form";

interface HandlePasteNewLineOptions<T> {
  event: ClipboardEvent<HTMLInputElement>;
  index: number;
  fieldName: string;
  arrayName: string;
  fields: FieldArrayWithId<T, string, "id">[];
  setValue: UseFormSetValue<any>;
  addEmptyItem: () => void;
}

export const handlePasteNewLine = <T>({
  event,
  index,
  fieldName,
  arrayName,
  fields,
  setValue,
  addEmptyItem,
}: HandlePasteNewLineOptions<T>) => {
  event.preventDefault();
  const clipboardData = event.clipboardData.getData("text");
  const lines = clipboardData.split(/\r\n|\r|\n/).filter((line) => !!line);

  lines.forEach((line, i) => {
    const fieldIndex = index + i;
    const fieldPath = `${arrayName}.${fieldIndex}.${fieldName}`;

    if (fieldIndex >= fields.length) {
      addEmptyItem();
    }
    setValue(fieldPath, line);
  });
};
