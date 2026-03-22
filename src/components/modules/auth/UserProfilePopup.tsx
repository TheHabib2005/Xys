"use client";

import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Settings, 
  ChevronRight, 
  UserCircle 
} from "lucide-react";

import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { IUser } from '@/interfaces/user';
import LogoutButton from './LogoutButton';

interface UserProfileProps {
  user: IUser;
  showDetails?: boolean; // Useful if you want to show name next to avatar in Sidebars
}

const UserProfile = ({ user, showDetails = false }: UserProfileProps) => {
  // Determine base path based on role
  const isAdmin = user.user.role === "ADMIN";
  const dashboardHref = isAdmin ? "/admin/dashboard" : "/dashboard";

  const menuItems = [
    {
      label: "Dashboard",
      href: dashboardHref,
      icon: LayoutDashboard,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button 
          className="group flex items-center gap-3 w-full outline-none transition-all rounded-xl hover:bg-accent/50 p-1.5"
          aria-label="User menu"
        >
          <div className="relative">
            <Avatar className="h-9 w-9 border-2 border-primary/10 group-hover:border-primary/30 transition-all shadow-sm">
              <AvatarImage src={user?.image || ""} alt={user.name} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary text-xs font-bold uppercase">
                {user.name?.charAt(0) || <UserCircle className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            {/* Online Status Dot */}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
          </div>

          {showDetails && (
            <div className="flex flex-1 flex-col items-start text-left overflow-hidden">
              <p className="text-sm font-semibold truncate w-full text-foreground leading-none mb-1">
                {user.name}
              </p>
              <p className="text-[11px] text-muted-foreground truncate w-full leading-none">
                {user.email}
              </p>
            </div>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent 
        className="w-72 p-2 mx-4 rounded-2xl shadow-xl border-border/50 bg-popover/95 backdrop-blur-md" 
        align={showDetails ? "center" : "end"}
        sideOffset={12}
      >
        {/* User Info Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-2 bg-muted/30 rounded-t-xl border-b border-border/40">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={user?.image || ""} alt={user.name} />
            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
              {user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-bold truncate text-foreground leading-none mb-1">
              {user.name}
            </p>
            <p className="text-[11px] text-muted-foreground truncate italic mb-2">
              {user.email}
            </p>
            <span className="w-fit px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-black uppercase tracking-tighter text-primary border border-primary/20">
              {user.user.role}
            </span>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href} className="block group">
              <div className="flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors" /> 
                  {item.label}
                </div>
                <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-2 pt-2 border-t border-border/50">
          <div className="px-1">
             <LogoutButton className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-destructive hover:bg-destructive/10 transition-colors" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserProfile;