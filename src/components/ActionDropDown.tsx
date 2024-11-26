"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { renameFile, updateFileUsers } from "@/lib/action/file.action";
import { usePathname } from "next/navigation";
import { FileDetails } from "./ActionsModalContent";
import {ShareInput} from "./ActionsModalContent";

const ActionDropDown = ({ file }: { file: Models.Document }) => {
  const [ismodalOpen, setIsmodalOpen] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [isDropDownOpen, setISDropDownOpen] = useState(false);
  const [name, setName] = useState<string>(file.name);
  const [action, setaction] = useState<ActionType | null>();
  const [emails, setemails] = useState<string[]>([]);
  const path = usePathname();
  

  const handleActions = async () => {
    if (!action) {
      return;
    }

    setisloading(true);
    let success = false;

    const actions = {
      rename: () =>
        renameFile({
          fileId: file.$id,
          name: name,
          extension: file.extension,
          path,
        }),

      share: () => updateFileUsers({fileId:file.$id,emails,path}),
      
      delete: () => {},
    };

    success = await actions[action.value as keyof typeof actions]();
    if (success) closeAllmodel();

    setisloading(false);
  };
  const closeAllmodel = () => {
    setISDropDownOpen(false);
    setIsmodalOpen(false);
    setisloading(false);
    setName(file.name);
  };

  const handleRemoveUser = async(email:string)=>{
    const updatedEmails = emails.filter(e=>e!== email)

    const success = await updateFileUsers({fileId:file.$id,emails:updatedEmails,path})

    if (!success) setemails(updatedEmails)

      closeAllmodel()
  }

  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;
    return (
      <DialogContent className="shad-dialog-button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className=" text-center to-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {value === "details" && <FileDetails file={file} />}
          {value === "share" && <ShareInput file={file} onInputChange = {setemails} onRemove={handleRemoveUser}/>}
        </DialogHeader>

        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllmodel} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleActions} className="modal-submit-button">
              <p className="capitalize">{value}</p>
              {isloading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="load"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
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
