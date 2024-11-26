import { Models } from "node-appwrite";
import React from "react";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";


interface Props {
  file: Models.Document;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
}

const ImageThubnail = ({ file }: { file: Models.Document }) => {
  return (
    <div className="file-details-thumbnail">
      <Thumbnail
        type={file.type}
        extension={file.extension}
        url={file.url}
        className=""
        imageClassName=""
      />

      <div className="flex flex-col">
        <p className="subtitle-2 mb-1"> {file.name}</p>

        <FormattedDateTime date={file.$createdAt} className={`caption `} />
      </div>
    </div>
  );
};

const Detailow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex ">
    <p className="file-details-label text-left">{label}</p>
    <p className="file-details-value text-left">{value}</p>
  </div>
);

export const FileDetails = ({ file }: { file: Models.Document }) => {
  return (
    <>
      <ImageThubnail file={file} />
      <div className="space-y-4 px-2 pt-2">
        <Detailow label="Format:" value={file.extension} />
        <Detailow label="size:" value={convertFileSize(file.size)} />
        <Detailow label="OWner:" value={file.owner.fullname} />
        <Detailow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
      </div>
    </>
  );
};

export const ShareInput = ({ file, onInputChange, onRemove }: Props) => {

  const {toast} = useToast()

  return (
    <>
      <ImageThubnail file={file} />

      <div className="share-wrapper">
        <p className="subtitle-2 text-light-100 pl-1">Share File with others</p>
        <Input
          type="email"
          placeholder="Enter email address"
          onChange={(e) => onInputChange(e.target.value.trim().split(","))}
          className="share-input-field"
        />

        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Share with</p>
            <p className="subtitle-2 text-light-100">
              {file.users.lenght} Users
            </p>
          </div>

          <ul className="pt-2">
            {file.users.map((email: string) => (
              <li
                key={email}
                className="flex items-center justify-between gap-2"
              >
                <p className="subtitle-2">{email}</p>
                <Button
                  onClick={() => {
                    if (!email === file.owner.email ) {
                      onRemove(email);
                    }
                    toast({
                        title:'Invaild Action',
                        description:'You Can not remove admin',
                        variant:"destructive"
                    })
                  }}
                  className="share-remove-user"
                >
                  <Image
                    src="/assets/icons/remove.svg"
                    alt="remove"
                    height={24}
                    width={24}
                    className="remove-icon"
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
