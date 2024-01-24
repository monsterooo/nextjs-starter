import React, { useMemo } from "react";
import { useFocusIdx } from "@easy-email-editor";
import { ColorPickerField } from "../../../components/Form";

export function ContainerBackgroundColor({
  title = t("Container background color"),
}: {
  title?: string;
}) {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      <ColorPickerField
        label={title}
        name={`${focusIdx}.attributes.container-background-color`}
      />
    );
  }, [focusIdx, title]);
}
