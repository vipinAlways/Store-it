"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/action/file.action";
import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import { useDebounce } from "@uidotdev/usehooks";

const Search = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Models.Document[]>([]);
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const searchQuey = searchParams.get("query") || "";
  const router = useRouter()
  const path = usePathname()
  const [debounceQuery] = useDebounce(query,300)

  useEffect(() => {


    const fetchFiles = async () => {

      if (!debounceQuery) {
        setResult([])
        setOpen(false)

        return router.push(path.replace(searchParams.toString(),''))
      }
      const files = await getFiles({
        searchText: debounceQuery,
        types:[],
        limit:20,
      
      });

      setResult(files.documents);
      setOpen(true);
    };

    fetchFiles();
  }, [debounceQuery,path,router,searchParams]);

  const handleClickItem = (file:Models.Document)=>{
    setOpen(false)
    setResult([])
    setQuery(file.name)
    router.push(`${(file.type === 'video' || file.type ==='audio') ? 'media' :file.type +'s'}?query=${debounceQuery}`)
  }
  useEffect(() => {
    if (!searchQuey) {
      setQuery("");
    }
  }, [searchQuey]);
  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src={"/assets/icons/search.svg"}
          alt="search"
          width={24}
          height={24}
        />

        <Input
          value={query}
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          
        />

        {open && <ul className="search-result">
          {
            result.length > 0 ? result.map((file)=>(
              <li onClick={()=>handleClickItem(file)} key={file.$id} className="flex items-center justify-between">
                <div className="flex cursor-pointer items-center gap-4">
                  <Thumbnail type={file.type} className="size-9 min-w-9 " imageClassName="" url={file.url} extension={file.extension}/>
                  <p className="subtitle-2 text-light-100 line-clamp-1">{file.name}</p>
                </div>

                <FormattedDateTime date={file.$createdAt} className="caption line-clamp-1"/>
              </li>
            )) :<p className="empty-result">No file found</p>
          }
        </ul>}
      </div>
    </div>
  );
};

export default Search;
