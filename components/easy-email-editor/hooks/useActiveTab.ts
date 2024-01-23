import { useContext } from "react";
import { BlocksContext } from "@easy-email-editor/components/Provider/BlocksProvider";

export function useActiveTab() {
  const { activeTab, setActiveTab } = useContext(BlocksContext);
  return {
    activeTab,
    setActiveTab,
  };
}
