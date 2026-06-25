"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { Mail, Lock, LogIn, Loader2, Compass, AlertCircle, ChefHat, Utensils, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
      <Suspense fallback={
        <div className="flex flex-grow items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle } = useAuth();

  useEffect(() => {
    document.title = "Log In | RecipeHub";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const handleCredentialResponse = async (response) => {
    try {
      setLoading(true);
      setErrorMsg("");
      const credential = response.credential;
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('0' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);
      
      const result = await loginWithGoogle(
        decoded.name,
        decoded.email,
        decoded.picture,
        redirectPath
      );
      
      if (!result.success) {
        setErrorMsg(result.error || "Google login failed");
      }
    } catch (err) {
      console.error("GSI Login Error:", err);
      setErrorMsg("Google Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initButton = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "370824720428-ha23fdbd9ctiqg6eauhquejek19utqo0.apps.googleusercontent.com",
          callback: handleCredentialResponse,
        });
        const buttonDiv = document.getElementById("google-signin-button");
        if (buttonDiv) {
          window.google.accounts.id.renderButton(
            buttonDiv,
            { 
              theme: document.documentElement.classList.contains("dark") ? "filled_black" : "outline", 
              size: "large", 
              width: "100%",
              text: "signin_with",
              shape: "pill"
            }
          );
        }
      }
    };

    if (window.google) {
      initButton();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initButton();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleGoogleMock = async (testProfile) => {
    setErrorMsg("");
    setLoading(true);
    
    let name = "Google Chef";
    let email = "google_chef@recipehub.com";
    let image = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100";

    if (testProfile === "foodie") {
      name = "Google Foodie";
      email = "google_foodie@recipehub.com";
      image = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100";
    } else if (testProfile === "admin") {
      name = "Admin Raymond";
      email = "admin_chef@recipehub.com";
      image = "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100";
    }

    const result = await loginWithGoogle(name, email, image, redirectPath);
    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.error || "Google login failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("All fields are required");
      return;
    }

    setLoading(true);
    const result = await login(email, password, redirectPath);
    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.error || "Invalid email or password");
    }
  };

  return (
    <div className="flex flex-grow items-center justify-center py-16 px-4 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 mb-4">
            <Compass className="h-6 w-6" />
          </Link>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Welcome back</h2>
          <p className="mt-2 text-xs text-zinc-450 dark:text-zinc-500">Sign in with credentials or seed a Google account</p>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-150 p-4 dark:bg-red-950/20 dark:border-red-900/50 flex items-start gap-2.5">
            <AlertCircle className="h-4.5 w-4.5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-700 dark:text-red-400 font-semibold">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-3xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">Email Address</label>
            <div className="relative flex items-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950">
              <Mail className="h-4 w-4 text-zinc-400 mr-2" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm outline-none text-zinc-800 dark:text-zinc-150"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-3xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">Password</label>
            <div className="relative flex items-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950">
              <Lock className="h-4 w-4 text-zinc-400 mr-2" />
              <input
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm outline-none text-zinc-800 dark:text-zinc-150"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/10 hover:bg-emerald-50 flex items-center justify-center gap-2 disabled:opacity-85"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <LogIn className="h-4 w-4" /> Log In
              </>
            )}
          </button>
        </form>

        {/* Real Google Login Button */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-150 dark:border-zinc-800" /></div>
          <div className="relative flex justify-center text-3xs font-bold uppercase"><span className="bg-white px-2 text-zinc-400 dark:bg-zinc-900">Or sign in with</span></div>
        </div>

        <div className="mb-6">
          <div id="google-signin-button" className="w-full flex justify-center min-h-[44px]" />
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-150 dark:border-zinc-800" /></div>
          <div className="relative flex justify-center text-3xs font-bold uppercase"><span className="bg-white px-2 text-zinc-400 dark:bg-zinc-900">Google Test Login</span></div>
        </div>

        {/* Google Mock logins */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleGoogleMock("chef")}
            disabled={loading}
            className="group relative overflow-hidden flex flex-col items-center justify-center rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50/40 to-amber-100/20 p-3 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-md hover:shadow-amber-500/5 active:translate-y-0 dark:border-amber-950/40 dark:from-amber-950/10 dark:to-amber-950/20 dark:hover:border-amber-800 cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 transition-colors duration-300 group-hover:bg-amber-500 group-hover:text-white dark:bg-amber-950/50 dark:text-amber-400 dark:group-hover:bg-amber-600">
              <ChefHat className="h-5 w-5" />
            </div>
            <span className="mt-2 text-3xs font-extrabold text-amber-800 transition-colors duration-300 group-hover:text-amber-950 dark:text-amber-300 dark:group-hover:text-amber-200">Chef</span>
            <span className="text-4xs text-amber-500 dark:text-amber-400 font-semibold opacity-70">Demo</span>
          </button>

          <button
            type="button"
            onClick={() => handleGoogleMock("foodie")}
            disabled={loading}
            className="group relative overflow-hidden flex flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50/40 to-emerald-100/20 p-3 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 active:translate-y-0 dark:border-emerald-950/40 dark:from-emerald-950/10 dark:to-emerald-950/20 dark:hover:border-emerald-800 cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-500 group-hover:text-white dark:bg-emerald-950/50 dark:text-emerald-400 dark:group-hover:bg-emerald-600">
              <Utensils className="h-5 w-5" />
            </div>
            <span className="mt-2 text-3xs font-extrabold text-emerald-800 transition-colors duration-300 group-hover:text-emerald-950 dark:text-emerald-300 dark:group-hover:text-emerald-200">Foodie</span>
            <span className="text-4xs text-emerald-500 dark:text-emerald-400 font-semibold opacity-70">Demo</span>
          </button>

          <button
            type="button"
            onClick={() => handleGoogleMock("admin")}
            disabled={loading}
            className="group relative overflow-hidden flex flex-col items-center justify-center rounded-2xl border border-purple-200 bg-gradient-to-b from-purple-50/40 to-purple-100/20 p-3 text-center transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-md hover:shadow-purple-500/5 active:translate-y-0 dark:border-purple-950/40 dark:from-purple-950/10 dark:to-purple-950/20 dark:hover:border-purple-800 cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 transition-colors duration-300 group-hover:bg-purple-500 group-hover:text-white dark:bg-purple-950/50 dark:text-purple-400 dark:group-hover:bg-purple-600">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <span className="mt-2 text-3xs font-extrabold text-purple-800 transition-colors duration-300 group-hover:text-purple-950 dark:text-purple-300 dark:group-hover:text-purple-200">Admin</span>
            <span className="text-4xs text-purple-500 dark:text-purple-400 font-semibold opacity-70">Demo</span>
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-emerald-600 hover:underline dark:text-emerald-450">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}
