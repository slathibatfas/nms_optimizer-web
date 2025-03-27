import React from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const ChangeLogContent: React.FC = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full p-8">
        <ExclamationTriangleIcon className="w-16 h-16" style={{ color: "#C44A34" }} />
        <h2 className="pt-4 text-2xl text-center" style={{ color: "#e6c133", fontFamily: "GeosansLight" }}>
          -kzzkt- Error! -kzzkt-
        </h2>
        <p className="font-bold text-center sidebar__error" style={{ color: "var(--gray-12)" }}>
          The server couldn't generate a solution for your grid.
        </p>
        <p className="mt-4 text-center sidebar__error" style={{ color: "var(--gray-12)" }}>
          Try a different placement order, reducing the number of technology types, or expanding your grid.
        </p>
      </div>
    </>
  );
};

export default ChangeLogContent;
