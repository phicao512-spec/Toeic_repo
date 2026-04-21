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

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        .sidebar-redesign {
          font-family: 'Outfit', sans-serif;
          width: 260px;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: linear-gradient(160deg, #0d1117 0%, #0f1623 50%, #0a1020 100%);
          border-right: 1px solid rgba(99, 179, 237, 0.08);
          position: relative;
          overflow: hidden;
        }

        /* Ambient glow background */
        .sidebar-redesign::before {
          content: '';
          position: absolute;
          top: -80px;
          left: -60px;
          width: 280px;
          height: 280px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
          pointer-events: none;
          border-radius: 50%;
        }
        .sidebar-redesign::after {
          content: '';
          position: absolute;
          bottom: 60px;
          right: -80px;
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.07) 0%, transparent 70%);
          pointer-events: none;
          border-radius: 50%;
        }

        /* ── Logo area ── */
        .sidebar-logo-area {
          padding: 22px 20px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }

        .sidebar-logo-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .sidebar-logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 0 0 1px rgba(139, 92, 246, 0.3),
            0 4px 20px rgba(99, 102, 241, 0.4),
            inset 0 1px 0 rgba(255,255,255,0.2);
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.3s ease;
        }
        .sidebar-logo-icon:hover {
          box-shadow:
            0 0 0 1px rgba(139, 92, 246, 0.5),
            0 4px 28px rgba(99, 102, 241, 0.6),
            inset 0 1px 0 rgba(255,255,255,0.25);
        }
        .sidebar-logo-icon::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 50%;
          background: linear-gradient(to bottom, rgba(255,255,255,0.15), transparent);
          border-radius: 12px 12px 0 0;
        }

        .sidebar-logo-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .sidebar-logo-title {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: 0.08em;
          line-height: 1;
        }
        .sidebar-logo-sub {
          font-size: 10px;
          font-weight: 500;
          color: #818cf8;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          line-height: 1;
        }

        .sidebar-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.35);
          padding: 6px;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
          display: flex;
        }
        .sidebar-close-btn:hover {
          color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.06);
        }

        /* ── Section label ── */
        .sidebar-section-label {
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.22);
          padding: 16px 20px 6px;
          font-family: 'Space Mono', monospace;
        }

        /* ── Nav ── */
        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 10px 12px 10px;
          position: relative;
          z-index: 1;
          scrollbar-width: thin;
          scrollbar-color: rgba(99, 102, 241, 0.2) transparent;
        }
        .sidebar-nav::-webkit-scrollbar { width: 3px; }
        .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
        .sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.25);
          border-radius: 99px;
        }

        .sidebar-nav-group {
          margin-bottom: 2px;
        }

        /* ── Nav item shared ── */
        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.52);
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          transition: all 0.18s ease;
          position: relative;
          letter-spacing: 0.01em;
        }
        .sidebar-nav-item:hover {
          color: rgba(255,255,255,0.88);
          background: rgba(255,255,255,0.05);
        }

        /* Active state */
        .sidebar-nav-item.active {
          color: #fff;
          background: linear-gradient(135deg,
            rgba(99, 102, 241, 0.22) 0%,
            rgba(139, 92, 246, 0.12) 100%);
          border: 1px solid rgba(99, 102, 241, 0.28);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.06),
            0 1px 8px rgba(99, 102, 241, 0.15);
          font-weight: 600;
        }
        /* Active left accent bar */
        .sidebar-nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          height: 60%;
          width: 3px;
          background: linear-gradient(to bottom, #818cf8, #6366f1);
          border-radius: 0 3px 3px 0;
        }

        /* Icon wrapper */
        .sidebar-icon-wrap {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: rgba(255,255,255,0.05);
          transition: background 0.18s ease;
        }
        .sidebar-nav-item:hover .sidebar-icon-wrap {
          background: rgba(99, 102, 241, 0.15);
        }
        .sidebar-nav-item.active .sidebar-icon-wrap {
          background: rgba(99, 102, 241, 0.25);
        }
        .sidebar-icon-wrap svg {
          width: 15px;
          height: 15px;
          opacity: 0.75;
        }
        .sidebar-nav-item.active .sidebar-icon-wrap svg {
          opacity: 1;
          color: #a5b4fc;
        }

        .sidebar-label { flex: 1; }

        .sidebar-chevron {
          width: 14px;
          height: 14px;
          opacity: 0.4;
          transition: transform 0.2s ease, opacity 0.2s;
          flex-shrink: 0;
        }
        .sidebar-nav-item:hover .sidebar-chevron,
        .sidebar-nav-item.active .sidebar-chevron {
          opacity: 0.7;
        }

        /* ── Children group ── */
        .sidebar-children {
          margin: 3px 0 3px 19px;
          padding-left: 14px;
          border-left: 1px solid rgba(99, 102, 241, 0.2);
          display: flex;
          flex-direction: column;
          gap: 1px;
          animation: slideDown 0.18s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .sidebar-child-item {
          display: flex;
          align-items: center;
          padding: 7px 12px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 12.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.42);
          transition: all 0.15s ease;
          position: relative;
        }
        .sidebar-child-item::before {
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          margin-right: 10px;
          flex-shrink: 0;
          transition: background 0.15s ease;
        }
        .sidebar-child-item:hover {
          color: rgba(255,255,255,0.82);
          background: rgba(255,255,255,0.04);
        }
        .sidebar-child-item:hover::before { background: #6366f1; }
        .sidebar-child-item.active {
          color: #a5b4fc;
          font-weight: 600;
        }
        .sidebar-child-item.active::before {
          background: #6366f1;
          box-shadow: 0 0 6px rgba(99, 102, 241, 0.7);
        }

        /* ── Footer ── */
        .sidebar-footer {
          padding: 14px 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
          position: relative;
          z-index: 1;
        }
        .sidebar-footer-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .sidebar-footer-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.5);
        }
        .sidebar-footer-text {
          font-size: 10px;
          color: rgba(255,255,255,0.2);
          font-family: 'Space Mono', monospace;
          letter-spacing: 0.06em;
        }
      `}</style>

      <aside className="sidebar-redesign">
        {/* ── Logo ── */}
        <div className="sidebar-logo-area">
          <Link href="/dashboard" className="sidebar-logo-link">
            <div className="sidebar-logo-icon">
              <GraduationCap style={{ width: 20, height: 20, color: '#fff', position: 'relative', zIndex: 1 }} />
            </div>
            <div className="sidebar-logo-text">
              <span className="sidebar-logo-title">TOEIC</span>
              <span className="sidebar-logo-sub">Master</span>
            </div>
          </Link>
          {onClose && (
            <button onClick={onClose} className="sidebar-close-btn lg:hidden">
              <X style={{ width: 16, height: 16 }} />
            </button>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Menu</div>

          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            const active = isActive(item.href);
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expanded[item.href] ?? active;

            return (
              <div key={item.href} className="sidebar-nav-group">
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpand(item.href)}
                    className={cn("sidebar-nav-item", active ? "active" : "")}
                  >
                    <span className="sidebar-icon-wrap">
                      {Icon && <Icon />}
                    </span>
                    <span className="sidebar-label">{item.label}</span>
                    {isExpanded
                      ? <ChevronDown className="sidebar-chevron" />
                      : <ChevronRight className="sidebar-chevron" />
                    }
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn("sidebar-nav-item", active ? "active" : "")}
                  >
                    <span className="sidebar-icon-wrap">
                      {Icon && <Icon />}
                    </span>
                    <span className="sidebar-label">{item.label}</span>
                  </Link>
                )}

                {/* Children */}
                {hasChildren && isExpanded && (
                  <div className="sidebar-children">
                    {item.children!.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "sidebar-child-item",
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

        {/* ── Footer ── */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-inner">
            <div className="sidebar-footer-dot" />
            <span className="sidebar-footer-text">© 2026 TOEIC Master</span>
            <div className="sidebar-footer-dot" />
          </div>
        </div>
      </aside>
    </>
  );
}