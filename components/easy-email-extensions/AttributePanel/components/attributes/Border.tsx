import React, { useMemo } from "react";
import { Grid } from "@arco-design/web-react";
import { useFocusIdx } from "@easy-email-editor";
import { InputWithUnitField, TextField } from "../../../components/Form";

export function Border() {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      <Grid.Row>
        <Grid.Col span={11}>
          <TextField
            label={t("Border")}
            name={`${focusIdx}.attributes.border`}
          />
        </Grid.Col>
        <Grid.Col offset={1} span={11}>
          <InputWithUnitField
            label={t("Border radius")}
            name={`${focusIdx}.attributes.border-radius`}
            unitOptions="percent"
          />
        </Grid.Col>
      </Grid.Row>
    );
  }, [focusIdx]);
}
