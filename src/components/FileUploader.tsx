'use client'
import React, { useCallback } from "react";
import {useDropzone} from 'react-dropzone'
import { Button } from "./ui/button";
import Image from "next/image";

interface Props {
  ownerId:string,
  accountId:string,
  className:string
}
const FileUploader = ({ownerId,accountId,className}:Props) => {
  const onDrop = useCallback(()=>{

  },[]);

  const {getRootProps,getInputProps,isDragActive} = useDropzone({onDrop})
  return <div {...getRootProps} className="cursor-pointer">
    <input {...getInputProps} />
    <Button type="button" className="uploader-button ">
      <Image src="/assets/icons/upload.svg" alt='upload' width={24} height={24}/>
    </Button>
    {
      isDragActive ? <p></p> :<p></p>
    }
  </div>;
};

export default FileUploader;
