import React from "react";
import { NavLink } from "react-router-dom";
const Navbar = () => {
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🌱" },
    { name: "Progress", path: "/progress", icon: "📈" },
    { name: "Community", path: "/community", icon: "🌍" },
    { name: "Profile", path: "/profile", icon: "👤" },
  ];
  return (
    <>
      {" "}
      {/* Desktop Sidebar */}{" "}
      <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-border h-[calc(100vh-64px)] sticky top-[64px] left-0 overflow-y-auto">
        {" "}
        <div className="p-6">
          {" "}
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
            Menu
          </p>{" "}
          <nav className="space-y-2">
            {" "}
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm" : "text-text-muted hover:bg-surface2 hover:text-text-main"}`
                }
              >
                {" "}
                <span className="text-xl">{item.icon}</span> {item.name}{" "}
              </NavLink>
            ))}{" "}
          </nav>{" "}
        </div>{" "}
      </aside>{" "}
      {/* Mobile Bottom Bar */}{" "}
      <nav className="lg:hidden fixed bottom-0 w-full bg-surface/80 dark:bg-[#0a0a0a]/80 backdrop-blur-[8px] border-t border-border/50 dark:border-[#222]/50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 px-2 pb-safe pt-2">
        {" "}
        <div className="flex justify-around items-center h-14">
          {" "}
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full rounded-lg ${isActive ? "text-emerald-600" : "text-text-muted"}`
              }
            >
              {" "}
              <span className="text-xl mb-1">{item.icon}</span>{" "}
              <span className="text-[10px] font-semibold">
                {item.name}
              </span>{" "}
            </NavLink>
          ))}{" "}
        </div>{" "}
      </nav>{" "}
    </>
  );
};
export default Navbar;
