import { useContext } from "react";
import { BlocksContext } from "@easy-email-editor/components/Provider/BlocksProvider";

export function useFocusIdx() {
  const { focusIdx, setFocusIdx } = useContext(BlocksContext);
  return {
    focusIdx,
    setFocusIdx,
  };
}
