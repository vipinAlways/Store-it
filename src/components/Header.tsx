import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import Search from './Search'
import FileUploader from './FileUploader'

const Header = () => {
  return (
   <header className='header'>
    <Search/>
     <div className='header-wrapper'>
            <FileUploader/>

      <form action="">
        <Button className='sign-out-button' type='submit'>
            <Image
            src='/assets/icons/logout.svg'
            alt='logo'
            width={24}
            height={24}
            className='w-6'
            />
        </Button>
      </form>
            </div>    
   </header>
  )
}

export default Header
