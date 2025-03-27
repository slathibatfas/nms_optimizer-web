import React from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

const ChangeLogContent: React.FC = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full p-8">
        <ExclamationTriangleIcon className="w-16 h-16" style={{ color: "#C44A34" }} />
        <h2 className="pt-4 text-2xl text-center" style={{ color: "#e6c133", fontFamily: "GeosansLight" }}>
          -kzzkt- Error! -kzzkt-
        </h2>
        <p className="text-center sidebar__error" style={{ color: "var(--gray-12)" }}>
          Sorry, the server timed out generating a solve! Try placing modules in a different order or adding additional cells to the grid.<br />
        </p>
      </div>
    </>
  );
};

export default ChangeLogContent;
