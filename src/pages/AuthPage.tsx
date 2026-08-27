import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { login, register } from "@/shared/api/auth";
import { useAuthStore } from "@/shared/store/auth.store";

type Mode = "login" | "register";

const tabClass = (active: boolean) =>
  `flex-1 rounded px-3 py-2 text-sm font-medium ${active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`;

const inputClass = "rounded border border-slate-300 px-2 py-1.5 text-sm";
const labelClass = "text-sm font-medium";

// Phase 2 prerequisite task, ahead of trip planning (#3): POST /itineraries
// requires an account, and no login/register UI existed yet even though the
// backend has shipped it since Phase 1.
export function AuthPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [mode, setMode] = useState<Mode>("login");
  const [identifier, setIdentifier] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const result =
        mode === "login"
          ? await login(identifier, password)
          : await register({
              phone: phone || undefined,
              email: email || undefined,
              password,
            });
      setAuth(result);
      return result;
    },
    onSuccess: () => navigate("/"),
  });

  return (
    <div className="flex h-full items-center justify-center p-4">
      <form
        className="flex w-full max-w-sm flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate();
        }}
      >
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={tabClass(mode === "login")}
          >
            {t("login_tab")}
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={tabClass(mode === "register")}
          >
            {t("register_tab")}
          </button>
        </div>

        {mode === "login" ? (
          <label className="flex flex-col gap-1">
            <span className={labelClass}>{t("identifier")}</span>
            <input
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className={inputClass}
              required
            />
          </label>
        ) : (
          <>
            <label className="flex flex-col gap-1">
              <span className={labelClass}>{t("phone")}</span>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className={labelClass}>{t("email")}</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
              />
            </label>
            <p className="text-xs text-slate-500">{t("phone_or_email_hint")}</p>
          </>
        )}

        <label className="flex flex-col gap-1">
          <span className={labelClass}>{t("password")}</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
            required
            minLength={8}
          />
        </label>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mutation.isPending
            ? t("submitting")
            : mode === "login"
              ? t("login_submit")
              : t("register_submit")}
        </button>

        {mutation.isError && (
          <p className="text-sm text-red-600">
            {mutation.error instanceof Error
              ? mutation.error.message
              : t("error_generic")}
          </p>
        )}
      </form>
    </div>
  );
}
