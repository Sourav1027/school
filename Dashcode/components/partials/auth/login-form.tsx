"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/routing";
import { Icon } from "@/components/ui/icon";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const schema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const apiurl = process.env.NEXT_PUBLIC_SITE_URL;

type FormData = {
  username: string;
  password: string;
  rememberMe?: boolean;
};

const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [passwordType, setPasswordType] = React.useState("password");
  const router = useRouter(); // Use the router from i18n routing

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const togglePasswordType = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  const onSubmit: SubmitHandler<{ username: string; password: string }> = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiurl}v1/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      console.log("API Response:", result);
  
      if (!response.ok) {
        toast.error(result.message || "Login failed");
        return;
      }
  
      const token = result.jwt;
      if (!token) {
        throw new Error("Token is missing from the API response");
      }
  
      localStorage.setItem("auth_token", token);
  
      toast.success("Successfully logged in");
      router.push("/dashboard/analytics"); // Use router.push for navigation
    } catch (err: any) {
      console.error("Error during login:", err);
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="font-medium text-default-600">
          Username
        </Label>
        <Input
          size="lg"
          disabled={isLoading}
          {...register("username")}
          type="text"
          id="username"
          className={cn("", {
            "border-destructive": errors.username,
          })}
        />
        {errors.username && (
          <div className="text-destructive mt-2 text-sm">
            {errors.username.message}
          </div>
        )}
      </div>

      <div className="mt-3.5 space-y-2">
        <Label htmlFor="password" className="mb-2 font-medium text-default-600">
          Password
        </Label>
        <div className="relative">
          <Input
            size="lg"
            disabled={isLoading}
            {...register("password")}
            type={passwordType}
            id="password"
            className="peer"
            placeholder=" "
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
            onClick={togglePasswordType}
          >
            {passwordType === "password" ? (
              <Icon icon="heroicons:eye" className="w-5 h-5 text-default-400" />
            ) : (
              <Icon icon="heroicons:eye-slash" className="w-5 h-5 text-default-400" />
            )}
          </div>
        </div>
        {errors.password && (
          <div className="text-destructive mt-2 text-sm">
            {errors.password.message}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <Checkbox id="checkbox" {...register("rememberMe")} />
          <Label htmlFor="checkbox">Keep Me Signed In</Label>
        </div>
        <Link href="/auth/forgot-password" className="text-sm text-default-800 dark:text-default-400 leading-6 font-medium">
          Forgot Password?
        </Link>
      </div>

      <Button fullWidth disabled={isLoading} type="submit">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;