"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import SignOut from "./sign_out";

export default function MobileMenu({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sm:hidden relative">
      <button className="p-2" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden">
          <div className="py-2">
            <div className="px-4 py-2 bg-gray-100">
              <p className="text-sm font-medium">Hey, {session.payload.given_name}!</p>
            </div>
            <div className="px-4 py-2">
              <SignOut variant="small" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}