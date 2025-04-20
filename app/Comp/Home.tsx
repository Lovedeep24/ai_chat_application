"use client";
import React from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
export default function Home() {
  return (
    <WavyBackground className="max-w-4xl mx-auto flex flex-col items-center justify-center pb-40">
    <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
    AI-Powered Learning, Anytime, Anywhere
    </p>
    <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
    Transform your learning experience with intelligent, real-time discussions
    </p>
  </WavyBackground>
  )
}
