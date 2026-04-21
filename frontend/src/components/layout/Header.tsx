"use client";

import Link from "next/link";
import { Menu, Bell, Search, User, LogOut, Settings, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  const [mockUser, setMockUser] = useState({ name: "Nguyễn Văn A", email: "user@example.com", targetScore: 750 });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setMockUser({
          name: parsed.fullName || parsed.name || parsed.email.split("@")[0] || "User",
          email: parsed.email || "user@example.com",
          targetScore: 750 // placeholder until API handles it
        });
      }
    } catch(e) {}
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b px-4 lg:px-6 w-full"
      style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>

      {/* Left: Mobile Nav */}
      <div className="flex items-center gap-2 lg:w-[200px]">
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
          <span className="font-bold text-sm hidden sm:inline-block">TOEIC Master</span>
        </Link>
      </div>

      {/* Center: Search bar */}
      <div className="hidden sm:flex flex-1 justify-center px-4 w-full max-w-2xl">
        <div className="w-full">
          {showSearch ? (
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <input
                autoFocus
                type="text"
                placeholder="Tìm từ vựng, bài học..."
                onBlur={() => setShowSearch(false)}
                className="input pl-9 h-10 text-base"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 px-3 h-10 rounded-xl border text-sm text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] transition-all w-full bg-slate-50/50 shadow-sm"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <Search className="h-4 w-4" />
              <span>Tìm kiếm...</span>
              <kbd className="ml-auto text-xs px-2 py-0.5 rounded border bg-white shadow-sm font-semibold" style={{ borderColor: "hsl(var(--border))" }}>⌘K</kbd>
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions & User */}
      <div className="flex items-center justify-end gap-3 lg:w-[200px]">
        {/* Search icon (mobile) */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="rounded-lg p-2 transition-colors hover:bg-[hsl(var(--muted))] sm:hidden"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Target score badge */}
        <div className="hidden md:flex flex-shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm"
          style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
          🎯 Mục tiêu: {mockUser.targetScore}
        </div>

        {/* Notifications */}
        <button className="relative rounded-xl p-2 transition-all hover:bg-slate-100 hover:text-slate-900 text-slate-500">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-xl p-1.5 pr-3 transition-colors hover:bg-slate-100 border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {getInitials(mockUser.name)}
            </div>
            <span className="hidden xl:block text-sm font-semibold text-slate-700">{mockUser.name.split(" ").slice(-1)[0]}</span>
          </button>

          {showUserMenu && (
            <div
              className="absolute right-0 top-full mt-2 w-56 rounded-2xl border shadow-xl p-2 z-50 bg-white"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="px-3 py-2 border-b mb-1 border-slate-100">
                <div className="font-bold text-sm text-slate-800">{mockUser.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{mockUser.email}</div>
              </div>
              <Link href="/profile" onClick={() => setShowUserMenu(false)}
                className={cn("flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-indigo-600 rounded-xl")}>
                <User className="w-4 h-4" /> Hồ sơ cá nhân
              </Link>
              <Link href="/settings" onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-indigo-600 rounded-xl">
                <Settings className="w-4 h-4" /> Cài đặt
              </Link>
              <div className="border-t mt-1 pt-1 border-slate-100">
                <button
                  onClick={() => {
                     setShowUserMenu(false);
                     window.location.href = "/login";
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium w-full text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
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
