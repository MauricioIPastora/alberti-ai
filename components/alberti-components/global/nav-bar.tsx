"use client";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
import Link from "next/link"
import { useState, useRef } from "react";
import SearchModal from "./search-modal";


export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchButtonRef = useRef<HTMLAnchorElement>(null);
    return (
        <>
        <div className="flex justify-center items-center h-21 gap-2">
            <div className="bg-gray-400/10 backdrop-blur-xs rounded-md justify-end p-1.5">
                <h2>Alberti.AI</h2>
            </div>
            <div className="justify-center">
            <div className="bg-gray-400/10 backdrop-blur-xs rounded-md p-1 ">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className="group-hover:opacity-30 hover:!opacity-100 transition-opacity duration-200">
                                <Link href="/">Home</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                                <NavigationMenuLink asChild className="group-hover:opacity-30 hover:!opacity-100 transition-opacity duration-200" >
                                    <Link ref={searchButtonRef} href="#" onClick={() => setIsSearchOpen(true)}>Search Jobs</Link>
                                </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink className="group-hover:opacity-30 hover:!opacity-100 transition-opacity duration-200"
                            asChild>
                                <Link href="/">About</Link>
                            </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
            <div className="bg-gray-400/10 backdrop-blur-xs rounded-md justify-start p-1.5">
                <h2>Sign in</h2>
            </div>
        </div>

            <SearchModal 
            isOpen={isSearchOpen}
            onOpenChange={setIsSearchOpen} 
            triggerRef={searchButtonRef}
            />
        </>
    )
}