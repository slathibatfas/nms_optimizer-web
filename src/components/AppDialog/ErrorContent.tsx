import React from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const ErrorContent: React.FC = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full p-8">
        <ExclamationTriangleIcon className="w-16 h-16 shadow-lg errorContent__icon" />
        <h2 className="pt-2 text-2xl font-semibold tracking-widest text-center errorContent__title">
          -kzzkt- Error! -kzzkt-
        </h2>
        <p className="pt-1 font-bold text-center errorContent__text">
          The server couldn't generate a solution for your grid.
        </p>
        <p className="pt-1 text-center errorContent__text">
          Try a different placement order, reducing the number of technology types, or expanding your grid.
        </p>
      </div>
    </>
  );
};

export default React.memo(ErrorContent);
