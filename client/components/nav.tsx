'use client'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import Link from 'next/link';

export default function Nav() {
  return (
    <header className="bg-card flex h-16 items-center justify-between gap-4 p-4 text-center">
      <div className="mx-auto flex w-full items-center justify-between md:max-w-7xl">
        <Link href="/" className="text-2xl font-bold">
          Krash Kourse
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/dashboard">Dashboard</Link>
          <div className="flex items-center">
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}