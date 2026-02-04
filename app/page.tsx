"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [noPText,setNoPText]=useState<boolean>(false)
  // position for the "No" button inside the card
  const [noPosition, setNoPosition] = useState({ top: 50, left: 70 });
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  // Check if "No" button overlaps with "Yes" button
  const checkYesButtonCollision = (
    noX: number,
    noY: number
  ): { collides: boolean; direction: { x: number; y: number } } => {
    // Yes button is at left: 30%, top: 50%
    const yesX = 30;
    const yesY = 50;

    // Button dimensions (approximate, as percentage of container)
    const buttonRadiusX = 12; // w-32 is roughly 8rem or ~15% of container
    const buttonRadiusY = 8; // h-16 is roughly 4rem or ~10% of container

    const dx = noX - yesX;
    const dy = noY - yesY;
    const distance = Math.hypot(dx, dy);

    // If buttons overlap
    if (distance < buttonRadiusX + buttonRadiusY) {
      const unitX = dx / distance || 0;
      const unitY = dy / distance || 0;
      return {
        collides: true,
        direction: { x: unitX, y: unitY },
      };
    }

    return { collides: false, direction: { x: 0, y: 0 } };
  };

  // Continuous movement based on cursor proximity
  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      mousePos.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  // Animate "No" button away from cursor
  useEffect(() => {
    const animationInterval = setInterval(() => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = ((mousePos.current.x - rect.left) / rect.width) * 100;
      const mouseY = ((mousePos.current.y - rect.top) / rect.height) * 100;

      const dx = mouseX - noPosition.left;
      const dy = mouseY - noPosition.top;
      const distance = Math.hypot(dx, dy);

      // if cursor is far away, do nothing
      const safeRadius = 60; // in %
      if (distance > safeRadius || distance === 0) return;

      // move in the opposite direction of the cursor
      const moveAmount = 12; // smooth incremental movement
      const unitX = dx / distance;
      const unitY = dy / distance;

      let newLeft = noPosition.left - unitX * moveAmount;
      let newTop = noPosition.top - unitY * moveAmount;

      // Check for collision with "Yes" button
      const collision = checkYesButtonCollision(newLeft, newTop);
      if (collision.collides) {
        // Push away from "Yes" button
        newLeft += collision.direction.x * moveAmount * 2;
        newTop += collision.direction.y * moveAmount * 2;
      }

      // clamp so it stays inside the card with more padding
      newTop = Math.min(95, Math.max(-10, newTop));
      newLeft = Math.min(95, Math.max(5, newLeft));

      setNoPosition({ top: newTop, left: newLeft });
    }, 25); // Update every 25ms for fast smooth animation

    return () => clearInterval(animationInterval);
  }, [noPosition]);

  const handleYes = async () => {
    // Send email notification
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Email sent successfully!");
      }
    } catch (error) {
      console.error("Failed to send email:", error);
    }

    // Navigate to the yay page
    router.push("/yay");
  };

  const handleNoClick = () => {
    // When clicked, move to a random safe position
    let newLeft = Math.random() * 80 + 10; // between 10 and 90
    let newTop = Math.random() * 80 + 10; // between 10 and 90

    // Make sure it doesn't overlap with "Yes" button
    let collision = checkYesButtonCollision(newLeft, newTop);
    let attempts = 0;
    while (collision.collides && attempts < 10) {
      newLeft = Math.random() * 80 + 10;
      newTop = Math.random() * 80 + 10;
      collision = checkYesButtonCollision(newLeft, newTop);
      attempts++;
    }
   
     
    setNoPosition({ top: newTop, left: newLeft });
     setTimeout(() => {
      setNoPText(true)
    }, 400);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="relative w-full max-w-xl rounded-4xl px-8 py-10 shadow-2xl backdrop-blur-md bg-[#89806380]/80" >
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-26 w-26 items-center justify-center rounded-full bg-transparent text-4xl">
            <Image 
              src="https://res.cloudinary.com/douco0ige/image/upload/v1770232552/emoji_vs53rh.png" 
              alt="heart emoji"
              width={120}
              height={120}
              className="h-32 w-32 object-contain bg-transparent"
            />
          </div>

          <h1 className="text-2xl font-semibold leading-snug text-neutral-900 sm:text-3xl">
            Can I surprise you with a little present?
          </h1>

          <p className={`text-sm text-neutral-700 h-5 overflow-hidden transition-opacity ${noPText ?'opacity-100':'opacity-0'}`}>
            “No” seems a bit shy 😈
          </p>

          <div
            className="relative mt-4 h-24 w-full max-w-xs gap-1"
            ref={containerRef}
          >
            <button
              type="button"
              onClick={handleYes}
              className="absolute left-[30%] top-1/2 flex h-16 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black text-xl font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:-translate-y-2 active:scale-95"
            >
              Yes
            </button>

            <button
              type="button"
              onClick={handleNoClick}
              style={{
                top: `${noPosition.top}%`,
                left: `${noPosition.left}%`,
                transform: "translate(-50%, -50%)",
              }}
              className="absolute z-10 flex h-16 w-32 items-center justify-center rounded-full bg-gray-600 text-xl font-semibold text-white shadow-md transition-all duration-300 ease-out"
            >
              No
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
