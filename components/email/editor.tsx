"use client";

import { useMemo, useState } from "react";
import {
  Button,
  ConfigProvider,
  Dropdown,
  Form,
  Input,
  Menu,
  Message,
  Modal,
  PageHeader,
  Select,
} from "@arco-design/web-react";
import enUS from "@arco-design/web-react/es/locale/en-US";
import { IconMoonFill, IconSunFill } from "@arco-design/web-react/icon";
import {
  AdvancedType,
  BasicType,
  IBlockData,
  JsonToMjml,
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
} from "@easy-email-extensions";
import { saveAs } from "file-saver";
import { cloneDeep, isEqual, set } from "lodash";
import mjml from "mjml-browser";
import { useWindowSize } from "react-use";
import { Stack } from "./components/Stack";
import { templateData } from "./data";
import { pushEvent } from "./utils/pushEvent";
import { Uploader } from "./utils/uploader";

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
  const [theme, setTheme] = useState<"blue" | "green" | "purple">("blue");
  const [locale, setLocale] = useState("en");
  const [visible, setVisible] = useState(false);
  const { width } = useWindowSize();

  const initialValues: IEmailTemplate | null = useMemo(() => {
    if (!templateData) return null;
    const sourceData = cloneDeep(templateData.content) as IBlockData;
    return {
      ...templateData,
      content: sourceData, // replace standard block
    };
  }, [templateData]);

  const smallScene = width < 1400;

  const onChangeTheme = () => {};

  const onImportMJML = async ({
    restart,
  }: {
    restart: (val: IEmailTemplate) => void;
  }) => {
    const uploader = new Uploader(() => Promise.resolve(""), {
      accept: "text/mjml",
      limit: 1,
    });

    const [file] = await uploader.chooseFile();
    const reader = new FileReader();
    const pageData = await new Promise<[string, IEmailTemplate["content"]]>(
      (resolve, reject) => {
        reader.onload = function (evt) {
          if (!evt.target) {
            reject();
            return;
          }
          try {
            const pageData = MjmlToJson(evt.target.result as any);
            resolve([file.name, pageData]);
          } catch (error) {
            reject();
          }
        };
        reader.readAsText(file);
      }
    );

    restart({
      subject: pageData[0],
      content: pageData[1],
      subTitle: "",
    });
  };

  const onImportJSON = async ({
    restart,
  }: {
    restart: (val: IEmailTemplate) => void;
  }) => {
    const uploader = new Uploader(() => Promise.resolve(""), {
      accept: "application/json",
      limit: 1,
    });

    const [file] = await uploader.chooseFile();
    const reader = new FileReader();
    const emailTemplate = await new Promise<IEmailTemplate>(
      (resolve, reject) => {
        reader.onload = function (evt) {
          if (!evt.target) {
            reject();
            return;
          }
          try {
            const template = JSON.parse(
              evt.target.result as any
            ) as IEmailTemplate;
            resolve(template);
          } catch (error) {
            reject();
          }
        };
        reader.readAsText(file);
      }
    );

    restart({
      subject: emailTemplate.subject,
      content: emailTemplate.content,
      subTitle: emailTemplate.subTitle,
    });
  };

  const onExportMJML = (values: IEmailTemplate) => {
    const mjmlString = JsonToMjml({
      data: values.content,
      mode: "production",
      context: values.content,
      dataSource: {},
    });

    pushEvent({ event: "MJMLExport", payload: { values, mergeTags: {} } });
    navigator.clipboard.writeText(mjmlString);
    saveAs(new Blob([mjmlString], { type: "text/mjml" }), "easy-email.mjml");
  };

  const onExportHTML = (values: IEmailTemplate) => {
    const mjmlString = JsonToMjml({
      data: values.content,
      mode: "production",
      context: values.content,
      dataSource: {},
    });

    const html = mjml(mjmlString, {} as any).html;

    pushEvent({ event: "HTMLExport", payload: { values, mergeTags: {} } });
    navigator.clipboard.writeText(html);
    saveAs(new Blob([html], { type: "text/html" }), "easy-email.html");
  };

  const onExportJSON = (values: IEmailTemplate) => {
    navigator.clipboard.writeText(JSON.stringify(values, null, 2));
    saveAs(
      new Blob([JSON.stringify(values, null, 2)], { type: "application/json" }),
      "easy-email.json"
    );
  };

  const onExportImage = async (values: IEmailTemplate) => {
    Message.loading("Loading...");
    const html2canvas = (await import("html2canvas")).default;
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    const mjmlString = JsonToMjml({
      data: values.content,
      mode: "production",
      context: values.content,
      dataSource: {},
    });

    const html = mjml(mjmlString, {} as any).html;

    container.innerHTML = html;
    document.body.appendChild(container);

    const blob = await new Promise<any>((resolve) => {
      html2canvas(container, { useCORS: true }).then((canvas) => {
        return canvas.toBlob(resolve, "png", 0.1);
      });
    });
    saveAs(blob, "demo.png");
    Message.clear();
  };

  return (
    <ConfigProvider locale={enUS}>
      <EmailEditorProvider
        id={id}
        data={initialValues}
        height={"calc(100vh - 68px)"}
      >
        {({ values }, { submit, restart }) => {
          return (
            <>
              <PageHeader
                style={{ background: "var(--color-bg-2)" }}
                backIcon
                title="Edit"
                onBack={() => {}}
                extra={
                  <Stack alignment="center">
                    <Button
                      onClick={() => {}}
                      shape="circle"
                      type="text"
                      icon={<IconSunFill />}
                    ></Button>

                    <Select onChange={onChangeTheme} value={theme}>
                      <Select.Option value="blue">Blue</Select.Option>
                      <Select.Option value="green">Green</Select.Option>
                      <Select.Option value="purple">Purple</Select.Option>
                    </Select>
                    <Select onChange={setLocale} value={locale}>
                      <Select.Option value="en">English</Select.Option>
                      <Select.Option value="zh-Hans">中文简体</Select.Option>
                      <Select.Option value="zh-Hant">中文繁體</Select.Option>
                      <Select.Option value="ja">Japanese</Select.Option>
                      <Select.Option value="it">Italian</Select.Option>
                    </Select>

                    {/* <Button onClick={openMergeTagsModal}>Update mergeTags</Button> */}

                    <Dropdown
                      droplist={
                        <Menu>
                          <Menu.Item
                            key="MJML"
                            onClick={() => onImportMJML({ restart })}
                          >
                            Import from MJML
                          </Menu.Item>

                          <Menu.Item
                            key="JSON"
                            onClick={() => onImportJSON({ restart })}
                          >
                            Import from JSON
                          </Menu.Item>
                        </Menu>
                      }
                    >
                      <Button>
                        <strong>Import</strong>
                      </Button>
                    </Dropdown>

                    <Dropdown
                      droplist={
                        <Menu>
                          <Menu.Item
                            key="Export MJML"
                            onClick={() => onExportMJML(values)}
                          >
                            Export MJML
                          </Menu.Item>
                          <Menu.Item
                            key="Export HTML"
                            onClick={() => onExportHTML(values)}
                          >
                            Export HTML
                          </Menu.Item>
                          <Menu.Item
                            key="Export JSON"
                            onClick={() => onExportJSON(values)}
                          >
                            Export JSON
                          </Menu.Item>
                          <Menu.Item
                            key="Export Image"
                            onClick={() => onExportImage(values)}
                          >
                            Export Image
                          </Menu.Item>
                        </Menu>
                      }
                    >
                      <Button>
                        <strong>Export</strong>
                      </Button>
                    </Dropdown>
                    <Button onClick={() => setVisible(true)}>
                      <strong>Try responsive editor</strong>
                    </Button>
                    <a
                      href="https://www.buymeacoffee.com/easyemail?utm_source=webside&utm_medium=button&utm_content=donate"
                      target="_blank"
                      rel="noreferrer"
                      onClick={(ev) => {
                        ev.preventDefault();
                        pushEvent({ event: "Donate" });
                        window.open(
                          "https://www.buymeacoffee.com/easyemail?utm_source=webside&utm_medium=button&utm_content=donate",
                          "_blank"
                        );
                      }}
                    >
                      <img
                        style={{
                          marginTop: -16,
                          position: "relative",
                          top: 11,
                          height: 32,
                        }}
                        src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png"
                        alt="Buy Me A Coffee"
                      />
                    </a>
                  </Stack>
                }
              />
              <StandardLayout
                compact={!smallScene}
                categories={defaultCategories}
              >
                <EmailEditor />
              </StandardLayout>
            </>
          );
        }}
      </EmailEditorProvider>
    </ConfigProvider>
  );
};

export default Editor;
