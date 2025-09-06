// src/app/(auth)/sign-up/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signinSchema } from "@/schemas/signinSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/Types/apiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const SignIn = () => {
  // const [email, setEmail] = useState("");
  // const [backendMessage, setBackendMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // onsubmit
  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setIsSubmitting(true);
    try {
      // backend data:  const { email, password } = await req.json();

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: "/dashboard"
      });

      console.log("data: ", data, "Response form Next-Auth: ",  result);

      // if success, then toast succes
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Signed in successfully 🟢");
        router.replace("/dashboard");
      }

    } catch (error) {
      console.log("error in signing-up: ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      // let errorMessage = axiosError.response?.data.message || "Something went wrong";
      toast.error(
        axiosError.response?.data.message || "Something went wrong 🔴"
      );

    }
    finally {
      setIsSubmitting(false);
    }
  };
  return (
    /*
    <div>
<Form {...form}>

  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    <div className="space-y-2 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Create an account
      </h1>
      <p className="text-sm text-muted-foreground">
        Enter your email below to create your account
      </p>
    </div>
   
   <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Full Name" {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        
<FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your Password" {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Student or Teacher</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col"
                >
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="student" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Student
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="teacher" />
                    </FormControl>
                    <FormLabel className="font-normal">Teacher</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full bg-black" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing up..." : "Sign In"}
        </Button>
 </form>
</Form>

<div className="text-center mt-4">
  <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="underline underline-offset-4 hover:text-primary">
          Sign In
        </Link>
      </p>
</div>

      
    </div>*/

    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 md:w-full lg:w-1/3 mx-auto"
        >
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-blue-400">
              Sign-in to your account
            </h1>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-300">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    className="bg-gray-900 text-blue-100 placeholder-blue-400 border border-blue-700 focus:border-blue-400 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
                  />
                </FormControl>
                <FormMessage className="text-blue-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-300">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your Password"
                    {...field}
                    className="bg-gray-900 text-blue-100 placeholder-blue-400 border border-blue-700 focus:border-blue-400 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
                  />
                </FormControl>
                <FormMessage className="text-blue-400" />
              </FormItem>
            )}
          />

          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-black font-semibold py-2 rounded-lg transition-all"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </Form>

      <div className="text-center mt-4">
        <p className="text-sm text-blue-200">
          Create an account?{" "}
          <Link
            href="/sign-up"
            className="underline underline-offset-4 hover:text-blue-400 transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
