'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { useSearchParams } from 'next/navigation'
import { getFiles } from '@/lib/action/file.action'
import { Models } from 'node-appwrite'

const Search = () => {
  const [query,setQuery] = useState('')
  const [result,setResult] = useState<Models.Document[]>([])
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const searchQuey = searchParams.get('query') || ''

  useEffect(()=>{
    const fetchFiles = async ()=>{
      const files = await getFiles({
        searchText:query,
        types:"",
        limit:'',
        sort: 
      })

      setResult(files.documents)
      setOpen(true)
    }
  })
  useEffect(()=>{
    if (!searchQuey) {
      setQuery('')
    }
  },[searchQuey])
  return (
    <div className='search'>
      <div className="search-input-wrapper">
        <Image src={'/assets/icons/search.svg'} alt='search' width={24} height={24}/>

        <Input value={query} className='search-input' onChange={(e)=>setQuery(e.target.value)}/>
      </div>
    </div>
  )
}

export default Search
