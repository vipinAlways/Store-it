"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import Image from "next/image";
import { convertFileToUrl, getFileType } from "@/lib/utils";
import Thumbnail from "./Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/action/file.action";
import { usePathname } from "next/navigation";

interface Props {
  ownerId: string;
  accountId: string;
  className: string;
}

const FileUploader = ({ ownerId, accountId }: Props) => {
  const path = usePathname();
  const { toast } = useToast();
  const [files, setfiles] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setfiles(acceptedFiles);
      const uploadPromises = acceptedFiles.map(async (file: File) => {
        if (file.size > MAX_FILE_SIZE) {
          setfiles((prev) => prev.filter((f) => f.name !== file.name));
          return toast({
            title: "",
            description: (
              <p className="body-2 text-white">
                <span className="font-semibold">{file.name}</span> is too large
                Max file size is 50 MB
              </p>
            ),
            className: "error-toast",
          });
        }

        return uploadFile({
          file,
          ownerId,
          accountId,
          path,
        }).then((isuploadFile) => {
          if (isuploadFile) {
            setfiles((prev) => prev.filter((f) => f.name !== file.name));
          }
        });
      });

      await Promise.all(uploadPromises)
    },
    [ownerId, accountId, path]
  );

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement>,
    fileName: string
  ) => {
    e.stopPropagation();
    setfiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className="uploader-button ">
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
        />
        <p>Upload</p>
      </Button>

      {files.length > 0 && (
        <ul className="uloapder-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li
                key={`${file.name} - ${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                    className=""
                    imageClassName=""
                  />

                  <div className="preview-item-name">
                    {file.name}

                    <Image
                      src="/assets/icons/file-loader.gif"
                      alt="loader"
                      width={80}
                      height={26}
                    />
                  </div>
                </div>
                <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="Remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
      {isDragActive ? <p></p> : <p></p>}
    </div>
  );
};

export default FileUploader;
