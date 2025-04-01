'use client';

import { useSession, signOut } from 'next-auth/react';
import * as React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { LogOut, User } from 'lucide-react';

export function UserNav() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const initials = session.user.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-900 ring-offset-white transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
          aria-label="Opções do usuário"
        >
          <Avatar.Root className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
            <Avatar.Fallback className="text-sm font-medium uppercase">
              {initials}
            </Avatar.Fallback>
          </Avatar.Root>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-md"
          align="end"
        >
          <DropdownMenu.Item className="flex cursor-default select-none items-center px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100">
            <User className="mr-2 h-4 w-4" />
            <span>{session.user.email}</span>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-slate-200" />
          <DropdownMenu.Item
            className="flex cursor-pointer select-none items-center px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
} 