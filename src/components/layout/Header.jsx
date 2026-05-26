import { Menu, Sparkles } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { appName, navigationItems } from "../../utils/constants.js";

function Header() {
  const location = useLocation();
  const currentItem =
    navigationItems.find((item) =>
      item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path),
    ) || navigationItems[0];

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-stone-100/90 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="hidden text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 sm:block">
            {appName}
          </p>
          <h1 className="truncate text-lg font-semibold text-zinc-950">
            {currentItem.label}
          </h1>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-600 shadow-sm sm:flex">
          <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
          <span>Local-first workspace</span>
        </div>

        <details className="relative lg:hidden">
          <summary className="focus-ring flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 shadow-sm">
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Open navigation</span>
          </summary>
          <div className="absolute right-0 mt-3 w-72 rounded-xl border border-zinc-200 bg-white p-2 shadow-soft">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                      isActive
                        ? "bg-zinc-950 text-white"
                        : "text-zinc-700 hover:bg-stone-100",
                    ].join(" ")
                  }
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </details>
      </div>
    </header>
  );
}

export default Header;
