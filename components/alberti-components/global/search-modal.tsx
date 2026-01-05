"use client";

import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { SearchIcon, MapPinIcon } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useRef, useLayoutEffect, RefObject, useState } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";

const searchSuggestions = [
    { id: 1, text: "Entry level software position", icon: "💻" },
    { id: 2, text: "Find me hospitality management roles", icon: "🏨" },
    { id: 3, text: "Consulting positions at Deloitte", icon: "📊" },
    { id: 4, text: "Remote marketing jobs", icon: "📱" },
  ];

  interface SearchModalProps {
    isOpen: boolean;
    onOpenChange: ( open: boolean ) => void;
    triggerRef: RefObject<HTMLAnchorElement | null>;
  }

  export default function SearchModal({ 
    isOpen, 
    onOpenChange,
    triggerRef 
}: SearchModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");
    const router = useRouter();
    const contentRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLDivElement>(null);
    const locationInputRef = useRef<HTMLDivElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        
        // Build query params
        const params = new URLSearchParams();
        params.set('query', searchQuery);
        if (location.trim()) {
            params.set('location', location);
        }
        
        const callBedrock = async () => {
            if (!searchQuery.trim()) return;
            await fetch('/api/bedrock-search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: searchQuery, location }),
            });
        };

        // Close modal and navigate
        onOpenChange(false);
        router.push(`/search-jobs?${params.toString()}`);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    
    const handleSuggestionClick = (suggestionText: string) => {
        setSearchQuery(suggestionText);
    };
    
    //Animation Logic
    useLayoutEffect(() => {
        if (!isOpen || !contentRef.current || !triggerRef.current) return;
        
        const content = contentRef.current;
        const trigger = triggerRef.current;
        
        // Get the trigger's position
        const triggerRect = trigger.getBoundingClientRect();
        
        // Get the modal's final position
        const modalFinalRect = content.getBoundingClientRect();
        
        // Calculate the center points
        const triggerCenterX = triggerRect.left + triggerRect.width / 2;
        const triggerCenterY = triggerRect.top + triggerRect.height / 2;
        
        const modalCenterX = window.innerWidth / 2;
        const modalCenterY = modalFinalRect.top + modalFinalRect.height / 2;
        
        // Calculate the offset needed to position modal at trigger location
        const offsetX = triggerCenterX - modalCenterX;
        const offsetY = triggerCenterY - modalCenterY;
        
        // Calculate scale to match trigger size
        const scaleX = triggerRect.width / modalFinalRect.width;
        const scaleY = triggerRect.height / modalFinalRect.height;
        
        // Set initial state immediately (before animation)
        gsap.set(content, {
            x: offsetX,
            y: offsetY,
            scaleX: scaleX,
            scaleY: scaleY,
            opacity: 1,
        });
        
        // Set overlay initial state
        gsap.set(overlayRef.current, {
            opacity: 0
        });
        
        // Hide content elements initially
        gsap.set([searchInputRef.current, locationInputRef.current, suggestionsRef.current], {
            opacity: 0
        });
        
        // Create the morphing timeline
        const tl = gsap.timeline({
            defaults: {
                ease: "power3.out"
            }
        });
        
        tl
        // Animate overlay
        .to(overlayRef.current, {
            opacity: 1,
            duration: 0.4
        }, 0)
        // Morph the container
        .to(content, {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 0.6,
            ease: "power4.out"
        }, 0)
        // Fade in search input
        .to(searchInputRef.current, {
            opacity: 1,
            duration: 0.3
        }, 0.3)
        // Fade in location input
        .to(locationInputRef.current, {
            opacity: 1,
            duration: 0.3
        }, 0.4)
        // Animate suggestions with stagger
        .to(suggestionsRef.current?.children || [], {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            duration: 0.3
        }, 0.5);
        
        return () => {
            tl.kill();
        };
        
    }, [isOpen, triggerRef]);
    // closing animation logic
    const handleClose = () => {
        if (!contentRef.current || !triggerRef.current) {
            onOpenChange(false);
            return;
        }
        
        const content = contentRef.current;
        const trigger = triggerRef.current;
        const triggerRect = trigger.getBoundingClientRect();
        
        const modalCenterX = window.innerWidth / 2;
        const modalCenterY = content.getBoundingClientRect().top + content.getBoundingClientRect().height / 2;
        
        const triggerCenterX = triggerRect.left + triggerRect.width / 2;
        const triggerCenterY = triggerRect.top + triggerRect.height / 2;
        
        const offsetX = triggerCenterX - modalCenterX;
        const offsetY = triggerCenterY - modalCenterY;
        
        const modalRect = content.getBoundingClientRect();
        const scaleX = triggerRect.width / modalRect.width;
        const scaleY = triggerRect.height / modalRect.height;
        
        const tl = gsap.timeline({
            onComplete: () => onOpenChange(false)
        });
        
        tl
        .to([searchInputRef.current, locationInputRef.current, suggestionsRef.current], {
            opacity: 0,
            duration: 0.15
        }, 0)
        .to(content, {
            x: offsetX,
            y: offsetY,
            scaleX: scaleX,
            scaleY: scaleY,
            opacity: 0.5,
            duration: 0.4,
            ease: "power2.in"
        }, 0.1)
        .to(overlayRef.current, {
            opacity: 0,
            duration: 0.3
        }, 0.1);
    };
    if (!isOpen) return null;
    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogPortal>
                <DialogOverlay ref={overlayRef} className=" bg-white/50 backdrop-blur-sm" />
                <DialogPrimitive.Content ref={contentRef} className="fixed top-7 left-1/2 -translate-x-1/2 w-full max-w-lg z-50
                    bg-gray-400/10 backdrop-blur-xl rounded-md text-black p-6 space-y-4" onEscapeKeyDown={handleClose} onPointerDownOutside={handleClose}>
                    
                    <div ref={searchInputRef}>
                    <InputGroup>
                        <InputGroupInput 
                            placeholder="What kind of job are you looking for?" 
                            className="text-black placeholder:text-gray-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <InputGroupAddon className="text-black">
                            <SearchIcon className="text-black" />
                        </InputGroupAddon>
                    </InputGroup>
                    </div>

                    <div ref={locationInputRef}>
                        <InputGroup>
                            <InputGroupInput placeholder="Where are you located?" className="text-black placeholder:text-gray-500"
                             value={location}
                             onChange={(e) => setLocation(e.target.value)}
                             onKeyDown={handleKeyDown}
                            />
                            <InputGroupAddon className="text-black">
                                <MapPinIcon className="text-black" />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>

                    <div ref={suggestionsRef}>
                        {searchSuggestions.map((suggestion) => (
                            <div 
                                key={suggestion.id} 
                                className="flex items-center gap-2 cursor-pointer hover:bg-gray-200/50 p-2 rounded-md transition-colors"
                                onClick={() => handleSuggestionClick(suggestion.text)}
                            >
                                <span className="text-gray-500">{suggestion.icon}</span>
                                <span className="text-gray-500">{suggestion.text}</span>
                            </div>
                        ))}
                    </div>
                    
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    )
}