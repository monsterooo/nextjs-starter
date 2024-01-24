import React, { useMemo } from "react";
import { useFocusIdx } from "@easy-email-editor";
import { ColorPickerField } from "../../../components/Form";

export function BorderColor() {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      <ColorPickerField
        label={t("Color")}
        name={`${focusIdx}.attributes.border-color`}
      />
    );
  }, [focusIdx]);
}
