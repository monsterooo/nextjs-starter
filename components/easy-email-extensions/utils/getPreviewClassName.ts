import { getNodeIdxClassName, getNodeTypeClassName } from "@easy-email-core";
import { classnames } from "@extensions/AttributePanel/utils/classnames";

export function getPreviewClassName(idx: string | null, type: string) {
  return classnames(
    "email-block",
    idx && getNodeIdxClassName(idx),
    getNodeTypeClassName(type)
  );
}
