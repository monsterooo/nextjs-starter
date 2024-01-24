import React, { useMemo } from "react";
import { useFocusIdx } from "@easy-email-editor";
import { useFontFamily } from "@extensions/hooks/useFontFamily";
import { AutoCompleteField } from "../../../components/Form";

export function FontFamily({ name }: { name?: string }) {
  const { focusIdx } = useFocusIdx();
  const { fontList } = useFontFamily();

  return useMemo(() => {
    return (
      <AutoCompleteField
        style={{ minWidth: 100, flex: 1 }}
        showSearch
        label={t("Font family")}
        name={name || `${focusIdx}.attributes.font-family`}
        options={fontList}
      />
    );
  }, [focusIdx, fontList, name]);
}
