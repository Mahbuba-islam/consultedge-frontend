"use client";

export default function Page() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Login form</h1>
    </div>
  );
}

// "use client";
// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { loginAction } from "@/src/app/(commonLayout)/(authRouteGroup)/login/_action";
// import AppField from "@/components/shared/form/AppField";
// import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { ILoginPayload, loginZodSchema } from "@/src/zod/auth.validation";
// import { useForm } from "@tanstack/react-form";
// import { useMutation } from "@tanstack/react-query";
// import { Eye, EyeOff } from "lucide-react";
// import Link from "next/link";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/authUtilis";

// interface LoginFormProps {
//   redirectPath?: string;
// }

// const LoginForm = ({ redirectPath }: LoginFormProps) => {
//   const router = useRouter();

//   const [serverError, setServerError] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState(false);

//   const { mutateAsync, isPending } = useMutation({
//     mutationFn: (payload: ILoginPayload) => loginAction(payload),
//   });

//   const form = useForm({
//     defaultValues: {
//       email: "",
//       password: "",
//     },

//     onSubmit: async ({ value }) => {
//       setServerError(null);

//       try {
//         const result = await mutateAsync(value);

//         if (!result.success) {
//           setServerError(result.message || "Login failed");
//           return;
//         }

//         // Extract user
//        const user = result.data.user;

//         const { role, emailVerified, needPasswordChange, email } = user;

//         // Redirect logic
//         if (!emailVerified) {
//           router.push(`/verify-email?email=${email}`);
//           return;
//         }

//         if (needPasswordChange) {
//           router.push(`/reset-password?email=${email}`);
//           return;
//         }

//         const finalPath =
//           redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
//             ? redirectPath
//             : getDefaultDashboardRoute(role as UserRole);

//         router.push(finalPath);
//       } catch (error: any) {
//         setServerError(`Login failed: ${error.message}`);
//       }
//     },
//   });

//   return (
//     <Card className="w-full max-w-md mx-auto shadow-md">
//       <CardHeader className="text-center">
//         <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
//         <CardDescription>Please enter your credentials to log in.</CardDescription>
//       </CardHeader>

//       <CardContent>
//         <form
//           method="POST"
//           noValidate
//           onSubmit={(e) => {
//             e.preventDefault();
//             e.stopPropagation();
//             form.handleSubmit();
//           }}
//           className="space-y-4"
//         >
//           <form.Field name="email" validators={{ onChange: loginZodSchema.shape.email }}>
//             {(field) => (
//               <AppField field={field} label="Email" type="email" placeholder="Enter your email" />
//             )}
//           </form.Field>

//           <form.Field name="password" validators={{ onChange: loginZodSchema.shape.password }}>
//             {(field) => (
//               <AppField
//                 field={field}
//                 label="Password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 append={
//                   <Button
//                     type="button"
//                     onClick={() => setShowPassword((value) => !value)}
//                     variant="ghost"
//                     size="icon"
//                   >
//                     {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
//                   </Button>
//                 }
//               />
//             )}
//           </form.Field>

//           <div className="text-right mt-2">
//             <Link href="/forgot-password" className="text-sm text-primary hover:underline underline-offset-4">
//               Forgot password?
//             </Link>
//           </div>

//           {serverError && (
//             <Alert variant={"destructive"}>
//               <AlertDescription>{serverError}</AlertDescription>
//             </Alert>
//           )}

//           <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
//             {([canSubmit, isSubmitting]) => (
//               <AppSubmitButton
//                 isPending={isSubmitting || isPending}
//                 pendingLabel="Logging In...."
//                 disabled={!canSubmit}
//               >
//                 Log In
//               </AppSubmitButton>
//             )}
//           </form.Subscribe>
//         </form>

//         <div className="relative my-6">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-300"></div>
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="px-2 bg-white text-gray-500">Or continue with</span>
//           </div>
//         </div>

//         <Button
//           variant="outline"
//           className="w-full"
//           onClick={() => {
//             const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
//             window.location.href = `${baseUrl}/api/v1/auth/google`;
//           }}
//         >
//           Sign in with Google
//         </Button>
//       </CardContent>

//       <CardFooter className="justify-center border-t pt-4">
//         <p className="text-sm text-muted-foreground">
//           Don&apos;t have an account?{" "}
//           <Link href="/register" className="text-primary font-medium hover:underline underline-offset-4">
//             Sign Up for an account
//           </Link>
//         </p>
//       </CardFooter>
//     </Card>
//   );
// };

// export default LoginForm;