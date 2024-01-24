import React from "react";
import { useFocusIdx } from "@easy-email-editor";
import { InputWithUnitField } from "../../../components/Form";

export function LineHeight({ name }: { name?: string }) {
  const { focusIdx } = useFocusIdx();

  return (
    <InputWithUnitField
      label={t("Line height")}
      unitOptions="percent"
      name={name || `${focusIdx}.attributes.line-height`}
    />
  );
}
