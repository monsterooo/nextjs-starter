import React from "react";
import { useFocusIdx } from "@easy-email-editor";
import { ColorPickerField } from "../../../components/Form";

export function Color({
  title = t("Color"),
}: {
  title?: string;
  inline?: boolean;
}) {
  const { focusIdx } = useFocusIdx();

  return (
    <ColorPickerField label={title} name={`${focusIdx}.attributes.color`} />
  );
}
