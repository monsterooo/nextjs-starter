import React from "react";
import { Collapse, Space } from "@arco-design/web-react";
import { useFocusIdx } from "@easy-email-editor";
import { AttributesPanelWrapper } from "../../attributes/AttributesPanelWrapper";
import { BackgroundColor } from "../../attributes/BackgroundColor";
import { Border } from "../../attributes/Border";
import { FontFamily } from "../../attributes/FontFamily";

export function AccordionElement() {
  const { focusIdx } = useFocusIdx();
  return (
    <AttributesPanelWrapper>
      <Collapse defaultActiveKey={["0", "1", "2"]}>
        <Collapse.Item name="0" header={t("Setting")}>
          <Space direction="vertical">
            <Border />
            <BackgroundColor />
            <FontFamily />
          </Space>
        </Collapse.Item>
      </Collapse>
    </AttributesPanelWrapper>
  );
}
