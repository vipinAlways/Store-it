'use client'
import React, { useCallback, useState } from "react";
import {useDropzone} from 'react-dropzone'
import { Button } from "./ui/button";
import Image from "next/image";
import { convertFileToUrl, getFileType } from "@/lib/utils";
import Thumbnail from "./Thumbnail";

interface Props {
  ownerId:string,
  accountId:string,
  className:string
}


const FileUploader = ({ownerId,accountId,className}:Props) => {

  const [files, setfiles] = useState<File[]>([])
  const onDrop = useCallback(async(acceptedFiles :File[])=>{
        setfiles(acceptedFiles)
  },[]);

  const {getRootProps,getInputProps,isDragActive} = useDropzone({onDrop})
  return <div {...getRootProps} className="cursor-pointer">
    <input {...getInputProps} />
    <Button type="button" className="uploader-button ">
      <Image src="/assets/icons/upload.svg" alt='upload' width={24} height={24}/>
      <p>Upload</p>
    </Button>

    {
      files.length  > 0 && <ul className="uloapder-preview-list">
        <h4 className="h4 text-light-100">
            Uploading
        </h4>

        {
          files.map((file,index)=>{
            const {type,extension} = getFileType(file.name)
            return (
              <li key={`${file.name} - ${index}`} className="uploader-preview-item">
                  <div className="flex items-center gap-3">
                    <Thumbnail type={type} extension={extension} url={convertFileToUrl(file)}/>
                  </div>
              </li>
            )
          })
        }
      </ul>
    }
    {
      isDragActive ? <p></p> :<p></p>
    }
  </div>;
};

export default FileUploader;
