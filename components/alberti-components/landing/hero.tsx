"use client"
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Hero() {    
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        const animation = gsap.to(".hero-video", {
            scale: 0, // shrink down to nothing
            opacity: 0, // fade out (optional)
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".hero",
              start: "200", // when the hero section has scrolled 200px
              end: "bottom top", // when .hero has scrolled out
              scrub: true, // smooth scrubbing
              pin: true, // keep video pinned during the animation
            },
        });

        return () => {
            animation.kill();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div data-scroll-container className="hero flex items-center justify-center h-screen w-full">
            <section data-scroll-section>
                <video 
                    className="hero-video"
                    src="\albert-ai-brain-8bit.mp4" 
                    muted 
                    playsInline 
                    preload="auto"
                    loop
                    autoPlay
                ></video>
            </section>
        </div>
    )
}