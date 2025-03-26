import React from "react";

const ChangeLogContent: React.FC = () => {
  return (
    <>
      <div className="infodialog__title">Changelog</div>
      <div className="infodialog__item">
        <h3 className="mb-2">Touch event support for mobile devices will be coming in the next release!</h3>
        <h3 className="mb-2 font-bold">Version 0.91α (2025-03-25)</h3>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">Added Instructions Dialog.</li>
          <li className="infodialog__list-item">Added Changelog Dialog.</li>
          <li className="infodialog__list-item">Improved UI/UX on mobile devices.</li>
          <li className="infodialog__list-item">
            Fixed an issue with grid refinement not finding the best solve.
            Improved packing algorithms.
          </li>
        </ul>
      </div>
      <div className="infodialog__item">
        <h3 className="mb-2 font-bold">Version 0.90α (2025-03-24)</h3>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">Initial alpha release.</li>
          <li className="infodialog__list-item">Basic grid functionality.</li>
          <li className="infodialog__list-item">Row activation/deactivation.</li>
          <li className="infodialog__list-item">Cell state toggling.</li>
          <li className="infodialog__list-item">Optimization API integration.</li>
          <li className="infodialog__list-item">Grid reset functionality.</li>
        </ul>
      </div>
    </>
  );
};

export default ChangeLogContent;
