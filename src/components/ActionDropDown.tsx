"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";
import { Models } from "node-appwrite";
import { actionsDropdownItems } from "@/constants";
import Link from "next/link";
import { constructFileUrl } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const ActionDropDown = ({ file }: { file: Models.Document }) => {
  const [ismodalOpen, setIsmodalOpen] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [isDropDownOpen, setISDropDownOpen] = useState(false);
  const [name, setName] = useState(file.name);
  const [action, setaction] = useState<ActionType | null>();


  const closeAllmodel = ()=>{
    setISDropDownOpen(false)
    setIsmodalOpen(false)
    setisloading(false)
  }

  const renderDialogContent = () => {
    if(!action) return null;

    const {value,label} = action
    return (
      <DialogContent className="shad-dialog-button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className=" text-center to-light-100">{label}</DialogTitle>
              {
                value ==='rename' && (
                  <Input type="text" value={name} onChange={(e)=>setName(e.target.value)}/>
                )
              }
        </DialogHeader>

        {
          ['rename','delete','share'].includes(value) && (
            <DialogFooter className="flex flex-col gap-3 md:flex-row">
              <Button>
                Cancel
              </Button>
              <Button>
                <p className="capitalize">{value}</p>
                {
                  isloading && <Image src='/assets/icons/loader.svg' alt="load" width={24} height={24} className="animate-spin"/>
                }
              </Button>
            </DialogFooter>
          )
        }
      </DialogContent>
    );
  };
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
              onClick={() => {
                setaction(actionItem);

                if (
                  ["rename", "share", "delete", "details"].includes(
                    actionItem.value
                  )
                ) {
                  setIsmodalOpen(true);
                }
              }}
            >
              {actionItem.value === "download" ? (
                <Link
                  href={constructFileUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={actionItem?.icon}
                    alt="logo"
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem?.icon}
                    alt="logo"
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropDown;
