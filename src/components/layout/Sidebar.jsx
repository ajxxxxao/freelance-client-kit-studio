import { NavLink } from "react-router-dom";
import { appName, navigationItems } from "../../utils/constants.js";

function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-zinc-200 bg-zinc-950 text-white lg:flex lg:flex-col">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-teal-400 font-semibold text-zinc-950">
            FK
          </div>
          <div>
            <p className="text-sm font-semibold leading-5">{appName}</p>
            <p className="text-xs text-zinc-400">Local-first client kit</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                  isActive
                    ? "bg-white text-zinc-950 shadow-sm"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white",
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-lg bg-white/[0.08] p-4 ring-1 ring-white/10">
          <p className="text-sm font-medium">Free workspace</p>
          <p className="mt-1 text-xs leading-5 text-zinc-400">
            Create client-ready documents from your local workspace.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
