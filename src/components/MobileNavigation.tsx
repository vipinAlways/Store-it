'use client'
import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Separator } from './ui/separator'
import { navItems } from '@/constants'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import FileUploader from './FileUploader'

interface porps {
  fullname:string,
  email:string,
  accountId:string,
  ownerId:string
}

const MobileNavigation = ({fullname,email,accountId,ownerId}:porps) => {
  const [open,setOpen] = useState(false)
  const pathName = usePathname()
  return (
    <header className='mobile-header'>
      <Image alt='logo' src='/assets/icons/logo-full-brand.svg' height={52} width={120} className='h-auto'/>
      <Sheet open={open} onOpenChange={setOpen} >
  <SheetTrigger className=''>
    <Image src='/assets/icons/menu.svg' alt='logo' height={30} width={30} className=''/>
  </SheetTrigger>
  <SheetContent className='shad-sheet h-screen px-3'>
    <>
      <SheetTitle>
        <div className='header-user'>
          <Image src={`/assets/images/sidebar-avatar.avif`} alt='sidelogo' width={44} height={44} className='header-user-avatar'/>
        </div>
        <div className="sm:hidden lg:block ">
          <p className='sutitle-2 capitalize'>
            {fullname}
          </p>
          <p className='caption'>
            {email}
          </p>
        </div>
        <Separator className='mb-4 bg-light-200/20'/>
      </SheetTitle>
 

     <nav className='mobile-nav'>
        <ul className='mobile-nav-list'>
        {
              navItems.map((item)=>{
                const active = pathName === item.url
                return <Link href={item.url} key={item.url} className="w-full">
                    <li className={cn('sidebar-nav-item',active && 'shad-active')}>
                      <Image
                      src={item.icon}
                      alt='logo'
                      width={24}
                      height={24}
                      className={cn('nav-icon',active && 'nav-icon-active')}
                      />
                      <p className="">{item.name}</p>
                    </li>
                </Link>
              })

              
            }
        </ul>
     </nav>


     <Separator className="my-5 bg-light-200/20" />

     <div className='flex flex-col justify-between gap-5'>
            <FileUploader/>
        <Button className='sign-out-button' onClick={()=>{}} type='submit'>
            <Image
            src='/assets/icons/logout.svg'
            alt='logo'
            width={24}
            height={24}
         
            />

            <p>Logout</p>
        </Button>
   
     </div>
    </>
  </SheetContent>
</Sheet>
    </header>
  )
}

export default MobileNavigation
