"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import { Terminal } from "lucide-react";

const AppBar = () => {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-8">
      <div className="flex items-center space-x-2 cursor-pointer">
        <Terminal className="h-6 w-6" />
        <span className="font-bold">CF Dashboard</span>
      </div>
      <div className="flex gap-3">
        <SignedOut>
          <Button variant="secondary">
            <SignInButton />
          </Button>
          <Button variant="secondary">
            <SignUpButton />
          </Button>
        </SignedOut>
      </div>
      <SignedIn>
        <Button variant="secondary">
          <UserButton />
        </Button>
      </SignedIn>
    </header>
  );
};

export default AppBar;
