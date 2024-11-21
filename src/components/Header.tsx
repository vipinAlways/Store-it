import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Search from "./Search";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/action/user.action";

const Header = ({userId,accountId}:{userId:string,accountId:string}) => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader accountId="" className="" ownerId='' />

        <form
          action={async () => {
            "use server";
            await signOutUser();
          }}
        >
          <Button className="sign-out-button" type="submit">
            <Image
              src="/assets/icons/logout.svg"
              alt="logo"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
