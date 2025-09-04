// src/app/(auth)/sign-up/page.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/signupSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/Types/apiResponse"
// import { set } from "mongoose"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
// import { da } from "zod/v4/locales"

const SignUp = () => {
  
const [email, setEmail] = useState("");
const [backendMessage, setBackendMessage] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
const router = useRouter();


const form = useForm<z.infer<typeof signupSchema>>({
  resolver: zodResolver(signupSchema),
  defaultValues: {
    name: "",
    email: "",
    password: "",
    type: "student",
  }
})


// onsubmit
const onSubmit = async (data: z.infer<typeof signupSchema>) => {
  setIsSubmitting(true);
  try {
    // backend data:  const { name, email, password, type } = await req.json();

    const response = await axios.post<ApiResponse>('/api/sign-up', data)
    console.log('data: ', data, 'response: ', response)

    // if success, then toast success
    if (response.data.success) {
      toast.success(response.data.message || "Account created successfully 🟢");
      router.replace(`/verify-email?identifier=${data.email.split('@')[0]}&type=${data.type}`);
    }

    setIsSubmitting(false);
    
  } catch (error) {
     console.log('error in signing-up: ', error);
     const axiosError = error as AxiosError<ApiResponse>;
    // let errorMessage = axiosError.response?.data.message || "Something went wrong";
    toast.error(axiosError.response?.data.message || "Something went wrong 🔴");
    setIsSubmitting(false);
    }
}
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
          {isSubmitting ? "Signing up..." : "Sign up"}
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 md:w-full lg:w-1/3 mx-auto">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-blue-400">
          Create an account
        </h1>
        <p className="text-sm text-blue-200">
          Enter your email below to create your account
        </p>
      </div>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-blue-300">Full Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your Full Name"
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

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-blue-300">Student or Teacher</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col"
                 
              >
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <RadioGroupItem value="student" className="border-blue-600 bg-blue-100 checked:bg-blue-200" />
                  </FormControl>
                  <FormLabel className="font-normal text-blue-200">
                    Student
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <RadioGroupItem value="teacher" className="border-blue-600 bg-blue-100 checked:bg-blue-500" />
                  </FormControl>
                  <FormLabel className="font-normal text-blue-200">Teacher</FormLabel>
                </FormItem>
              </RadioGroup>
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
        {isSubmitting ? "Signing up..." : "Sign up"}
      </Button>
    </form>
  </Form>

  <div className="text-center mt-4">
    <p className="text-sm text-blue-200">
      Already have an account?{" "}
      <Link
        href="/sign-in"
        className="underline underline-offset-4 hover:text-blue-400 transition-colors"
      >
        Sign In
      </Link>
    </p>
  </div>
</div>

  
)
}

export default SignUp;