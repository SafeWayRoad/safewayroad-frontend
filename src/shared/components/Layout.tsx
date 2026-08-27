import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuthStore } from "@/shared/store/auth.store";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm font-medium ${isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-700"}`;

// Bare-bones nav shell for Phase 2 task #0. Visual identity (palette,
// typography, signature layout element) is deliberately not decided here —
// that's a design pass on its own, once there's real content (map,
// incident cards) to design around, not an empty shell.
export function Layout() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <span className="font-semibold">{t("app_name")}</span>
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={navLinkClass}>
            {t("nav.map")}
          </NavLink>
          <NavLink to="/report" className={navLinkClass}>
            {t("nav.report")}
          </NavLink>
          <NavLink to="/plan" className={navLinkClass}>
            {t("nav.plan_trip")}
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={clearAuth}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              {t("nav.logout")}
            </button>
          ) : (
            <NavLink to="/login" className={navLinkClass}>
              {t("nav.login")}
            </NavLink>
          )}
          <LanguageSwitcher />
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
