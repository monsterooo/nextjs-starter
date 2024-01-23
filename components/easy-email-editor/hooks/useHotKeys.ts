import { useEffect } from "react";
import { getNodeIdxFromClassName } from "@easy-email-core";
import { getEditorRoot, getShadowRoot } from "@easy-email-editor/utils";
import { getBlockNodeByChildEle } from "@easy-email-editor/utils/getBlockNodeByChildEle";
import isHotkey from "is-hotkey";
import { useBlock } from "./useBlock";
import { useEditorContext } from "./useEditorContext";
import { useFocusIdx } from "./useFocusIdx";

function isContentEditFocus() {
  const isShadowRootFocus = document.activeElement === getEditorRoot();
  if (isShadowRootFocus) {
    if (
      getEditorRoot()?.shadowRoot?.activeElement?.getAttribute(
        "contenteditable"
      ) === "true"
    ) {
      return true;
    }
  } else {
    if (
      ["input", "textarea"].includes(
        document.activeElement?.tagName.toLocaleLowerCase() || ""
      ) ||
      document.activeElement?.getAttribute("contenteditable") === "true"
    ) {
      return true;
    }
  }
  return false;
}

export function useHotKeys() {
  const { redo, undo, removeBlock } = useBlock();
  const { focusIdx, setFocusIdx } = useFocusIdx();
  const {
    formState: { values },
  } = useEditorContext();

  const root = getShadowRoot();
  // redo/undo
  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (isContentEditFocus()) return;
      if (isHotkey("mod+z", ev)) {
        ev.preventDefault();
        undo();
      }
      if (isHotkey("mod+y", ev) || isHotkey("mod+shift+z", ev)) {
        ev.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [redo, undo]);

  // delete
  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      const isShadowRootFocus = document.activeElement === getEditorRoot();

      if (!isShadowRootFocus) return;
      if (isContentEditFocus()) return;
      // if (isHotkey('delete', ev) || isHotkey('backspace', ev)) {
      //   removeBlock(focusIdx);
      // }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [focusIdx, removeBlock]);

  // focus
  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      const isShadowRootFocus = document.activeElement === getEditorRoot();

      if (!isShadowRootFocus) return;
      if (isHotkey("tab", ev) || isHotkey("shift+tab", ev)) {
        setTimeout(() => {
          const activeElement = getShadowRoot().activeElement;
          if (activeElement instanceof HTMLElement) {
            const blockNode = getBlockNodeByChildEle(activeElement);
            if (blockNode) {
              const idx = getNodeIdxFromClassName(blockNode.classList)!;
              setFocusIdx(idx);
            }
          }
        }, 0);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [focusIdx, removeBlock, setFocusIdx, values]);
}
