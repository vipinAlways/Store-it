import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/action/user.action";
import { redirect } from "next/navigation";
import React from "react";

const layout = async({children}: {children:React.ReactNode}) => {

  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return redirect('/sign-in')
  } 

  console.log(currentUser,'ye hain');
  return (
    <main className=" flex h-screen">
      <Sidebar fullName={currentUser.fullname} email={currentUser.email}/>
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation/> 
        <Header/>
        
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
};

export default layout;
