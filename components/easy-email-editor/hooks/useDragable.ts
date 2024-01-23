import { useContext } from "react";
import { BlocksContext } from "@easy-email-editor/components/Provider/BlocksProvider";

export function useDraggable() {
  const { dragEnabled, setDragEnabled } = useContext(BlocksContext);
  return {
    dragEnabled,
    setDragEnabled,
  };
}
