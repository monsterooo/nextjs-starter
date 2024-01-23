"use client";

import { useState } from "react";
import { ConfigProvider } from "@arco-design/web-react";
import enUS from "@arco-design/web-react/es/locale/en-US";
import {
  AdvancedType,
  BasicType,
  BlockManager,
  IBlockData,
} from "@easy-email-core";
import {
  BlockAvatarWrapper,
  EmailEditor,
  EmailEditorProvider,
  EmailEditorProviderProps,
  IEmailTemplate,
} from "@easy-email-editor";
import {
  BlockMarketManager,
  ExtensionProps,
  MjmlToJson,
  StandardLayout,
} from "easy-email-extensions";

const defaultCategories: ExtensionProps["categories"] = [
  {
    label: "Content",
    active: true,
    blocks: [
      {
        type: AdvancedType.TEXT,
      },
      {
        type: AdvancedType.IMAGE,
        payload: { attributes: { padding: "0px 0px 0px 0px" } },
      },
      {
        type: AdvancedType.BUTTON,
      },
      {
        type: AdvancedType.SOCIAL,
      },
      {
        type: AdvancedType.DIVIDER,
      },
      {
        type: AdvancedType.SPACER,
      },
      {
        type: AdvancedType.HERO,
      },
      {
        type: AdvancedType.WRAPPER,
      },
    ],
  },
  {
    label: "Layout",
    active: true,
    displayType: "column",
    blocks: [
      {
        title: "2 columns",
        payload: [
          ["50%", "50%"],
          ["33%", "67%"],
          ["67%", "33%"],
          ["25%", "75%"],
          ["75%", "25%"],
        ],
      },
      {
        title: "3 columns",
        payload: [
          ["33.33%", "33.33%", "33.33%"],
          ["25%", "25%", "50%"],
          ["50%", "25%", "25%"],
        ],
      },
      {
        title: "4 columns",
        payload: [["25%", "25%", "25%", "25%"]],
      },
    ],
  },
];

const Editor = () => {
  const [id, setId] = useState("123");
  const defaultData = {
    subject: "welcome",
    subTitle: "Nice to meet you!",
    content: BlockManager.getBlockByType(BasicType.PAGE).create({
      children: [BlockManager.getBlockByType(AdvancedType.WRAPPER).create()],
    }),
  };
  return (
    <ConfigProvider locale={enUS}>
      <EmailEditorProvider id={id} data={defaultData} height="100vh">
        {() => {
          return (
            <div>
              <StandardLayout compact={true} categories={defaultCategories}>
                <EmailEditor />
              </StandardLayout>
            </div>
          );
        }}
      </EmailEditorProvider>
    </ConfigProvider>
  );
};

export default Editor;
