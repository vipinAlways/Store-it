import Link from "next/link";
import { Models } from "node-appwrite";
import React from "react";
import Thumbnail from "./Thumbnail";
import { convertFileSize } from "@/lib/utils";
import ActionDropDown from "./ActionDropDown";
import FormattedDateTime from "./FormattedDateTime";

const Card = ({ file }: { file: Models.Document }) => {
  return (
    <Link className="file-card" target="_blank" href={file.url}>
      <div className="flex justify-between">
        <Thumbnail
          className="!size-20"
          imageClassName="!size-11"
          url={file.url}
          type={file.type}
          extension={file.extension}
        />
        <div className="flex flex-col items-end justify-between">
          <ActionDropDown file={file} />
          <p className="body-1">{convertFileSize(file.size)}</p>
        </div>
      </div>
      <div className="file-car-details">
        <p className="subtitle-2 line-clamp-1">{file.anme}</p>

        <FormattedDateTime
          date={file.$createdAt}
          className="body-2 text-light-100"
        />

        <p className="caption line-clamp-1 text-light-200">By: {file.name}</p>
      </div>
    </Link>
  );
};

export default Card;
