'use client'
import { navItems } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = ({fullname,email}:{fullname :string,email:string}) => {
  const pathName = usePathname()
  return (
    <div>
      <aside className="sidebar max-md:justify-between max-md:h-full">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full-brand.svg"
            alt="sidebar"
            width={160}
            height={50}
            className="hidden h-auto lg:block"
          />

          <Image
            src="/assets/icons/logo-brand.svg"
            alt="logo"
            width={52}
            height={52}
            className="lg:hidden"
          />
        </Link>
        <nav className="sidebar-nav">
          <ul className="flex flex-1 flex-col gap-6">
            {
              navItems.map((item)=>{
                const active = pathName === item.url
                return <Link href={item.url} key={item.url} className={cn("w-full",!active && "hover:scale-105 transition-all")}>
                    <li className={cn('sidebar-nav-item',active && 'shad-active')}>
                      <Image
                      src={item.icon}
                      alt='logo'
                      width={24}
                      height={24}
                      className={cn('nav-icon',active && 'nav-icon-active',)}
                      />
                      <p className="hidden lg:block">{item.name}</p>
                    </li>
                </Link>
              })

              
            }
          </ul>
        </nav>


        <Image
        src='/assets/images/files-2.png'
        alt="logo"
        width={506}
        height={418}
        className="w-full mix-blend-difference"
        />
        <div className="sidebar-user-info">
          <Image
          src='/assets/images/sidebar-avatar.avif'
          alt="avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
          />

          <div className="hidden lg:block">
            <p className="subtitle-2 capitalize">
              {fullname}
            </p>
            <p className="caption">
              {email}
            </p>


          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
