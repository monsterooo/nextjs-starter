import { useContext } from "react";
import { PreviewEmailContext } from "@easy-email-editor/components/Provider/PreviewEmailProvider";

export function usePreviewEmail() {
  return useContext(PreviewEmailContext);
}
