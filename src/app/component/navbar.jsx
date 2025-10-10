"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-black border-b border-gray-800 px-8 py-4 flex items-center justify-between">
      <Link href="/">
        <span className="text-blue-400 text-xl font-bold cursor-pointer hover:text-blue-500 transition-colors">
          Form
        </span>
      </Link>

      
      <div></div>
    </nav>
  );
}
