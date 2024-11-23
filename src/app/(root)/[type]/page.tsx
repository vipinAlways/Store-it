import Card from '@/components/Card'
import Sort from '@/components/Sort'
import { getFiles } from '@/lib/action/file.action'
import { Car } from 'lucide-react'
import { Models } from 'node-appwrite'
import React from 'react'

const page = async({params}:SearchParamProps) => {
    const type =(await params )?.type as string || ''

    const files =await getFiles()
  return ( 
    <div className='page-container'>
        <section className='w-full'>
            <h1 className="h1 capitalize" >
                {type}

                <div className="total-size-section">
                    <p className="body-1">
                        Total: <span className="h5">0MB</span>
                    </p>
                    <div className="sort-container">
                        <p className="body-1 hidden sm:block text-light-200">
                            Sort by:
                        </p>
                        <Sort/>
                    </div>
                </div>
            </h1>
        </section>
        {
            files.total > 0  ?    
            <section className='file-list '>
                    {
                        files.documents.map((file:Models.Document)=>(
                            <Card key={file.$id} file={file}/>
                        ))
                    }
            </section>
            :  <p>no more file</p>
        }
        
    </div>
  )
}

export default page