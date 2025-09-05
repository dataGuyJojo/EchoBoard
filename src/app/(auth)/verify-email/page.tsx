"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/Types/apiResponse";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const identifier = searchParams.get("identifier");
  const type = searchParams.get("type");

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: "",
      code: "",

    },
  });

  // onsubmit

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      // backend data:  const { name, email, password, type } = await req.json();

      const response = await axios.post<ApiResponse>("/api/verify-code", data);
      console.log("data: ", data, "response: ", response);

      // if success, then toast success
      if (response.data.success) {
        toast.success(
          response.data.message || "Email verified successfully 🟢"
        );
        router.replace(`/sign-in`);
      }
    } catch (error) {
      console.log("error in varifying: ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      // let errorMessage = axiosError.response?.data.message || "Something went wrong";
      toast.error(
        axiosError.response?.data.message || "Something went wrong 🔴"
      );
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-shadow-indigo-200 border border-black w-full h-screen">
      <div className="border border-white p-10">
        <div className="mb-6 text-indigo-200">
          <h1 className="text-3xl font-bold mb-1">Verify Email</h1>
          <p>
            <span className="font-bold text-indigo-400">Identifier:</span>{" "}
            {identifier}
          </p>
          <p>
            {" "}
            <span className="font-bold text-indigo-400">Type:</span> {type}
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=""
          > 
          
          <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-blue-300">Enter Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="bg-gray-900 text-blue-100 placeholder-blue-400 border border-blue-700 focus:border-blue-400 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-blue-300">Enter OTP</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter OTP"
                      {...field}
                      className="bg-gray-900 text-blue-100 placeholder-blue-400 border border-blue-700 focus:border-blue-400 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-black font-semibold py-2 rounded-lg transition-all mt-4"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
