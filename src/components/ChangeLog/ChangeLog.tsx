// src/components/ChangeLog/ChangeLog.tsx
import React, { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button, Heading, Text, Theme } from "@radix-ui/themes";

interface ChangeLogItem {
  version: string;
  date: string;
  changes: string[];
}

const changeLogData: ChangeLogItem[] = [
  {
    version: "0.90α",
    date: "2025-03-24",
    changes: [
      "Initial alpha release.",
      "Basic grid functionality.",
      "Row activation/deactivation.",
      "Cell state toggling.",
      "Optimization API integration.",
      "Grid reset functionality.",
    ],
  },
  {
    version: "0.91α",
    date: "2025-03-25",
    changes: [
      "Added Instructions Dialog.",
      "Added Changelog Dialog.",
      "Improved UI/UX.",
      "Fixed an issue with grid refinement not finding the best solve. Improved packing algorithms.",
    ],
  },
  // Add more changelog entries here
];

interface ChangeLogProps {
  onClose: () => void;
}

const ChangeLog: React.FC<ChangeLogProps> = ({ onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="changelog__overlay" />
        <Theme appearance="dark" accentColor="blue">
          <Dialog.Content className="changelog__content">
            <Dialog.Title className="changelog__title">Changelog</Dialog.Title>
            <div className="changelog__container">
              {/* Reverse the order of the changeLogData array */}
              {changeLogData.slice().reverse().map((item, index) => (
                <div key={index} className="changelog__item">
                  <Heading size="4">{item.version}</Heading>
                  <Text className="changelog__date">{item.date}</Text>
                  <ul className="mt-2 changelog__list">
                    {item.changes.map((change, changeIndex) => (
                      <li key={changeIndex} className="changelog__list-item">
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Dialog.Close asChild>
              <Button variant="soft" className="changelog__close">
                <Cross2Icon />
              </Button>
            </Dialog.Close>
          </Dialog.Content>
        </Theme>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
export default ChangeLog;
