"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import {
  LayoutDashboard, BookOpen, Headphones, FileText,
  ClipboardList, BookMarked, TrendingUp, Trophy,
  ChevronDown, ChevronRight, X, GraduationCap,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, BookOpen, Headphones, FileText,
  ClipboardList, BookMarked, TrendingUp, Trophy,
};

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (href: string) => {
    setExpanded((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="sidebar flex flex-col h-full w-64">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm leading-tight">TOEIC</div>
            <div className="text-xs text-blue-300 font-medium">Master</div>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const active = isActive(item.href);
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expanded[item.href] ?? active;

          return (
            <div key={item.href}>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(item.href)}
                  className={cn(
                    "sidebar-item w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium",
                    active ? "active" : ""
                  )}
                >
                  {Icon && <Icon className="w-4.5 h-4.5 flex-shrink-0" />}
                  <span className="flex-1 text-left">{item.label}</span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 opacity-60" />
                  ) : (
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "sidebar-item flex items-center gap-3 px-3 py-2.5 text-sm font-medium",
                    active ? "active" : ""
                  )}
                >
                  {Icon && <Icon className="w-4.5 h-4.5 flex-shrink-0" />}
                  <span>{item.label}</span>
                </Link>
              )}

              {/* Children */}
              {hasChildren && isExpanded && (
                <div className="ml-4 mt-0.5 space-y-0.5 pl-4 border-l border-white/10">
                  {item.children!.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "sidebar-item flex items-center px-3 py-2 text-xs font-medium",
                        pathname === child.href ? "active" : ""
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="text-xs text-white/40 text-center">© 2026 TOEIC Master</div>
      </div>
    </aside>
  );
}
