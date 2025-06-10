import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthForm } from "@/components/auth/AuthForm";
import { SocialLogin } from "@/components/auth/SocialLogin";

export default function SigninForm() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#f5f0e6]">
      <div className="w-full max-w-[450px]">
      
        <div className="w-full border-0 shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight text-black dark:text-white">
              Welcome back
            </CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AuthForm />
            <SocialLogin />
          </CardContent>
        </div>
      </div>
    </div>
  );
}