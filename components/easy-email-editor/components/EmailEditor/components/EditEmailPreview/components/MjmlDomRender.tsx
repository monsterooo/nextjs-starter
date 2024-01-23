import React, { useEffect, useMemo, useState } from "react";
import { IPage, JsonToMjml, getPageIdx } from "@easy-email-core";
import {
  DATA_RENDER_COUNT,
  FIXED_CONTAINER_ID,
} from "@easy-email-editor/constants";
import { useEditorContext } from "@easy-email-editor/hooks/useEditorContext";
import { useEditorProps } from "@easy-email-editor/hooks/useEditorProps";
import { getEditorRoot, getShadowRoot } from "@easy-email-editor/utils";
import { HtmlStringToReactNodes } from "@easy-email-editor/utils/HtmlStringToReactNodes";
import { cloneDeep, isEqual } from "lodash";
import mjml from "mjml-browser";
import { createPortal } from "react-dom";

let count = 0;
export function MjmlDomRender() {
  const { pageData: content } = useEditorContext();
  const [pageData, setPageData] = useState<IPage | null>(null);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const { dashed, mergeTags, enabledMergeTagsBadge } = useEditorProps();
  const [isTextFocus, setIsTextFocus] = useState(false);

  const isTextFocusing =
    document.activeElement === getEditorRoot() &&
    getShadowRoot().activeElement?.getAttribute("contenteditable") === "true";

  useEffect(() => {
    if (!isTextFocus && !isEqual(content, pageData)) {
      setPageData(cloneDeep(content));
    }
  }, [content, pageData, setPageData, isTextFocus]);

  useEffect(() => {
    setIsTextFocus(isTextFocusing);
  }, [isTextFocusing]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (getEditorRoot()?.contains(e.target as Node)) {
        return;
      }
      const fixedContainer = document.getElementById(FIXED_CONTAINER_ID);
      if (fixedContainer?.contains(e.target as Node)) {
        return;
      }
      setIsTextFocus(false);
    };

    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    const root = getShadowRoot();
    if (!root) return;
    const onClick = (e: Event) => {
      const isFocusing =
        getShadowRoot().activeElement?.getAttribute("contenteditable") ===
        "true";
      if (isFocusing) {
        setIsTextFocus(true);
      }
    };

    root.addEventListener("click", onClick);
    return () => {
      root.removeEventListener("click", onClick);
    };
  }, []);

  const html = useMemo(() => {
    if (!pageData) return "";

    const renderHtml = mjml(
      JsonToMjml({
        data: pageData,
        idx: getPageIdx(),
        context: pageData,
        mode: "testing",
        dataSource: cloneDeep(mergeTags),
      })
    ).html;
    return renderHtml;
  }, [mergeTags, pageData]);

  return useMemo(() => {
    return (
      <div
        {...{
          [DATA_RENDER_COUNT]: count++,
        }}
        data-dashed={dashed}
        ref={setRef}
        style={{
          outline: "none",
          position: "relative",
        }}
        role="tabpanel"
        tabIndex={0}
      >
        <>
          {ref &&
            createPortal(
              HtmlStringToReactNodes(html, {
                enabledMergeTagsBadge: Boolean(enabledMergeTagsBadge),
              }),
              ref
            )}
        </>
      </div>
    );
  }, [dashed, ref, html, enabledMergeTagsBadge]);
}
