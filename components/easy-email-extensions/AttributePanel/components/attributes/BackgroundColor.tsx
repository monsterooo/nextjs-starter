import React, { useMemo } from "react";
import { useFocusIdx } from "@easy-email-editor";
import { ColorPickerField } from "../../../components/Form";

export function BackgroundColor({
  title = t("Background color"),
}: {
  title?: string;
}) {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      <ColorPickerField
        label={title}
        name={`${focusIdx}.attributes.background-color`}
      />
    );
  }, [focusIdx, title]);
}
