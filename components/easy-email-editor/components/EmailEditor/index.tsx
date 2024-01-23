import React, { useCallback, useMemo } from "react";
import { TabPane, Tabs } from "@easy-email-editor/components/UI/Tabs";
import {
  EASY_EMAIL_EDITOR_ID,
  FIXED_CONTAINER_ID,
} from "@easy-email-editor/constants";
import { useActiveTab } from "@easy-email-editor/hooks/useActiveTab";
import { useEditorProps } from "@easy-email-editor/hooks/useEditorProps";
import { createPortal } from "react-dom";
import { IconFont } from "../IconFont";
import { ActiveTabKeys } from "../Provider/BlocksProvider";
import { Stack } from "../UI/Stack";
import { DesktopEmailPreview } from "./components/DesktopEmailPreview";
import { EditEmailPreview } from "./components/EditEmailPreview";
import { MobileEmailPreview } from "./components/MobileEmailPreview";
import { ToolsPanel } from "./components/ToolsPanel";
import "./index.scss";
import "@easy-email-editor/assets/font/iconfont.css";
import { EventManager, EventType } from "@easy-email-editor/utils/EventManager";

(window as any).global = window; // react-codemirror

export const EmailEditor = () => {
  const { height: containerHeight } = useEditorProps();
  const { setActiveTab, activeTab } = useActiveTab();

  const fixedContainer = useMemo(() => {
    return createPortal(<div id={FIXED_CONTAINER_ID} />, document.body);
  }, []);

  const onBeforeChangeTab = useCallback((currentTab: any, nextTab: any) => {
    return EventManager.exec(EventType.ACTIVE_TAB_CHANGE, {
      currentTab,
      nextTab,
    });
  }, []);

  const onChangeTab = useCallback(
    (nextTab: string) => {
      setActiveTab(nextTab as any);
    },
    [setActiveTab]
  );

  return useMemo(
    () => (
      <div
        id={EASY_EMAIL_EDITOR_ID}
        style={{
          display: "flex",
          flex: "1",
          overflow: "hidden",
          justifyContent: "center",
          minWidth: 640,
          height: containerHeight,
        }}
      >
        <Tabs
          activeTab={activeTab}
          onBeforeChange={onBeforeChangeTab}
          onChange={onChangeTab}
          style={{ height: "100%", width: "100%" }}
          tabBarExtraContent={<ToolsPanel />}
        >
          <TabPane
            style={{ height: "calc(100% - 50px)" }}
            tab={
              <Stack spacing="tight">
                <IconFont iconName="icon-editor" />
              </Stack>
            }
            key={ActiveTabKeys.EDIT}
          >
            <EditEmailPreview />
          </TabPane>
          <TabPane
            style={{ height: "calc(100% - 50px)" }}
            tab={
              <Stack spacing="tight">
                <IconFont iconName="icon-desktop" />
              </Stack>
            }
            key={ActiveTabKeys.PC}
          >
            <DesktopEmailPreview />
          </TabPane>
          <TabPane
            style={{ height: "calc(100% - 50px)" }}
            tab={
              <Stack spacing="tight">
                <IconFont iconName="icon-mobile" />
              </Stack>
            }
            key={ActiveTabKeys.MOBILE}
          >
            <MobileEmailPreview />
          </TabPane>
        </Tabs>
        <>{fixedContainer}</>
      </div>
    ),
    [activeTab, containerHeight, fixedContainer, onBeforeChangeTab, onChangeTab]
  );
};
