import React from "react";
import { BasicType } from "@easy-email-core";
import { IconFont } from "@easy-email-editor";
import { IBlockDataWithId } from "../..";

export function EyeIcon({
  blockData,
  hidden,
  onToggleVisible,
}: {
  blockData: IBlockDataWithId;
  hidden?: boolean;
  onToggleVisible: (blockData: IBlockDataWithId, ev: React.MouseEvent) => void;
}) {
  if (hidden)
    return (
      <div style={{ visibility: "hidden" }}>
        <IconFont iconName="icon-eye" />
      </div>
    );
  if (blockData.type === BasicType.PAGE) return null;

  return blockData.data.hidden ? (
    <IconFont
      onClick={(ev) => onToggleVisible(blockData, ev)}
      iconName="icon-eye-invisible"
    />
  ) : (
    <IconFont
      onClick={(ev) => onToggleVisible(blockData, ev)}
      iconName="icon-eye"
    />
  );
}
