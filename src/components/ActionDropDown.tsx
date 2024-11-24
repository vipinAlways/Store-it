"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog } from "./ui/dialog";
import Image from "next/image";
import { Models } from "node-appwrite";
import { actionsDropdownItems } from "@/constants";

const ActionDropDown = ({ file }: { file: Models.Document }) => {
  const [ismodalOpen, setIsmodalOpen] = useState(false);
  const [isDropDownOpen, setISDropDownOpen] = useState(false);
  const [action, setaction] = useState<ActionType | null>();
  return (
    <Dialog open={ismodalOpen} onOpenChange={setIsmodalOpen}>
      <DropdownMenu open={isDropDownOpen} onOpenChange={setISDropDownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="shad-dropdown-item"
              onClick={() => setaction(actionItem)}
            >
              {actionItem.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
};

export default ActionDropDown;
