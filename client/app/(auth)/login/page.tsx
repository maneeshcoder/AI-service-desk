"use client";

import { useState , useEffect} from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

const STAGES = ["Open", "In progress", "Resolved"] as const;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return; // respect it — leave the indicator static

    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginForm) {
    setServerError(null);
    try {
      await login(data.email, data.password);
      router.push("/");
    } catch (err: any) {
      setServerError(err?.response?.data?.message ?? "Something went wrong");
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel — signature element */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-slate-100 p-12">
        <div>
          <p className="text-sm font-medium tracking-wide text-indigo-400">AI SERVICE DESK</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight max-w-sm">
            Every ticket, triaged before a human even opens it.
          </h1>
        </div>

        <div className="space-y-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Ticket lifecycle</p>
          <div className="flex items-center gap-3">
            {STAGES.map((stage, i) => (
              <div key={stage} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-colors duration-700 ${
                      i === activeStage ? "bg-indigo-400" : "bg-slate-700"
                    }`}
                  />
                  <span className="text-xs text-slate-400">{stage}</span>
                </div>
                {i < STAGES.length - 1 && <span className="h-px w-8 bg-slate-700 -mt-5" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
            <p className="text-sm text-slate-500">Log in to view and manage your tickets.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            {serverError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {serverError}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="text-sm text-slate-500 text-center">
            Don't have an account?{" "}
            <a href="/register" className="text-indigo-600 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}