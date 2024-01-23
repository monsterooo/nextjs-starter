// import Editor from "@/components/email/editor";
import React from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/email/editor"), {
  ssr: false,
});

const Workspace = () => {
  return (
    <div>
      <Editor />
    </div>
  );
};

export default Workspace;
