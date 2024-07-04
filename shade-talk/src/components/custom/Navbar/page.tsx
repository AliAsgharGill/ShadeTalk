"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <>
      <nav className="p-4 md:p-6 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center ">
          <Link href={"/"}>SHAD-TALK</Link>
          <div>
            {session ? (
              <div>
                <span>Hello, {user?.name || user?.email}</span>
                <Button className="w-full md:w-auto" onClick={() => signOut()}>
                  Sign out
                </Button>
              </div>
            ) : (
              <Link href={"/sign-in"}>
                <Button className="w-full md:w-auto">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
