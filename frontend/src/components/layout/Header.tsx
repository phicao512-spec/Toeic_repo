"use client";

import Link from "next/link";
import { Menu, Bell, Search, User, LogOut, Settings, GraduationCap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

interface HeaderProps {
  onMenuClick: () => void;
}

// Mock user - will be replaced with real auth
const mockUser = { name: "Nguyễn Văn A", email: "user@example.com", targetScore: 750 };

export function Header({ onMenuClick }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b px-4 lg:px-6"
      style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>

      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 transition-colors hover:bg-[hsl(var(--muted))] lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Logo (mobile) */}
      <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-sm">TOEIC Master</span>
      </Link>

      {/* Search bar */}
      <div className="flex-1 max-w-md hidden sm:block">
        {showSearch ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <input
              autoFocus
              type="text"
              placeholder="Tìm từ vựng, bài học..."
              onBlur={() => setShowSearch(false)}
              className="input pl-9 h-9 text-sm"
            />
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-3 h-9 rounded-lg border text-sm text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))] transition-colors w-full"
            style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}
          >
            <Search className="h-4 w-4" />
            <span>Tìm kiếm...</span>
            <kbd className="ml-auto text-xs px-1.5 py-0.5 rounded border" style={{ borderColor: "hsl(var(--border))" }}>⌘K</kbd>
          </button>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Search icon (mobile) */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="rounded-lg p-2 transition-colors hover:bg-[hsl(var(--muted))] sm:hidden"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Target score badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))" }}>
          🎯 Mục tiêu: {mockUser.targetScore}
        </div>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 transition-colors hover:bg-[hsl(var(--muted))]">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-xl p-1.5 pr-3 transition-colors hover:bg-[hsl(var(--muted))]"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {getInitials(mockUser.name)}
            </div>
            <span className="hidden md:block text-sm font-medium">{mockUser.name.split(" ").slice(-1)[0]}</span>
          </button>

          {showUserMenu && (
            <div
              className="absolute right-0 top-full mt-2 w-52 rounded-xl border shadow-xl py-1.5 z-50"
              style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
            >
              <div className="px-3 py-2 border-b mb-1" style={{ borderColor: "hsl(var(--border))" }}>
                <div className="font-semibold text-sm">{mockUser.name}</div>
                <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{mockUser.email}</div>
              </div>
              <Link href="/profile" onClick={() => setShowUserMenu(false)}
                className={cn("flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-[hsl(var(--muted))]")}>
                <User className="w-4 h-4" /> Hồ sơ cá nhân
              </Link>
              <Link href="/settings" onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-[hsl(var(--muted))]">
                <Settings className="w-4 h-4" /> Cài đặt
              </Link>
              <div className="border-t mt-1 pt-1" style={{ borderColor: "hsl(var(--border))" }}>
                <button className="flex items-center gap-2.5 px-3 py-2 text-sm w-full text-left text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
