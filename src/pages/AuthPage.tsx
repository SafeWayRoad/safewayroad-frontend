import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { login, register, loginWithGoogle } from "@/shared/api/auth";
import { useAuthStore } from "@/shared/store/auth.store";

type Mode = "login" | "register";

const tabClass = (active: boolean) =>
  `flex-1 rounded px-3 py-2 text-sm font-medium ${active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`;

const inputClass = "rounded border border-slate-300 px-2 py-1.5 text-sm";
const labelClass = "text-sm font-medium";

// Phase 2 prerequisite task, ahead of trip planning (#3): POST /itineraries
// requires an account. Extended (decision 28/08/2026) with Google sign-in —
// a single button regardless of the login/register tab, since the backend
// endpoint (POST /auth/google) transparently signs in or creates the
// account — and an international phone input (react-phone-number-input,
// Cameroon pre-selected) replacing the plain text field.
export function AuthPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [mode, setMode] = useState<Mode>("login");
  const [identifier, setIdentifier] = useState("");
  const [phone, setPhone] = useState<string>("");
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

  const googleMutation = useMutation({
    mutationFn: async (idToken: string) => {
      const result = await loginWithGoogle(idToken);
      setAuth(result);
      return result;
    },
    onSuccess: () => navigate("/"),
  });

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      googleMutation.mutate(credentialResponse.credential);
    }
  };

  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-4">
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

        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
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
                <PhoneInput
                  international
                  defaultCountry="CM"
                  value={phone}
                  onChange={(value) => setPhone(value ?? "")}
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
              <p className="text-xs text-slate-500">
                {t("phone_or_email_hint")}
              </p>
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

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs uppercase text-slate-400">
            {t("or_divider")}
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => googleMutation.reset()}
            text={mode === "login" ? "signin_with" : "signup_with"}
          />
        </div>

        {googleMutation.isPending && (
          <p className="text-center text-sm text-slate-500">
            {t("submitting")}
          </p>
        )}
        {googleMutation.isError && (
          <p className="text-center text-sm text-red-600">
            {googleMutation.error instanceof Error
              ? googleMutation.error.message
              : t("google_error")}
          </p>
        )}
      </div>
    </div>
  );
}
