"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import axios, { AxiosError } from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { GiveReviewFromIdSchema } from "@/schemas/GiveReviewFromIdSchema";
import { toast } from "sonner";
import { ApiResponse } from "@/Types/apiResponse";
import { reviewSchema } from "@/schemas/reviewSchema";

interface Class {
  _id: string;
  classCode: string;
  className: string;
  series: string;
  section: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [classes, setClasses] = useState<Class[]>([]);
  const [classIdtoGiveReview, setClassIdtoGiveReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [GiveReviewofId, setGiveReviewofId] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      clarity: 1,
      engagement: 1,
      fairness: 1,
      materials: 1,
      difficulty: 1,
      teaching: 1,
      courseQuality: 1,
      learning: 1,
      message: "",
    },
  });

  const formGiveReviewUsingClassId = useForm<
    z.infer<typeof GiveReviewFromIdSchema>
  >({
    resolver: zodResolver(GiveReviewFromIdSchema),
    defaultValues: {
      ClassId: "",
    },
  });

  // useEffect(() => {
  //   console.log("session: ", session, "status: ", status);
  //   if (status === "authenticated") {

  //     axios
  //       .get("/api/classes")
  //       .then((res) => setClasses(res.data.classes))
  //       .catch((err) => console.error("Error fetching classes", err));
  //   }
  // }, [status]);

  if (status === "loading") {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (!session) {
    return <p className="text-center text-red-500">You are not signed in</p>;
  }

  const user = session.user as any; // we extended the session with extra fields in your callbacks

  const GiveReviewofAClassusingId = async (
    data: z.infer<typeof GiveReviewFromIdSchema>
  ) => {
    setIsSubmitting(true);
    try {
      setGiveReviewofId(true);
      setClassIdtoGiveReview(data.ClassId);
    } catch (error) {
      console.error("Error giving review", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof reviewSchema>) => {
    //console.log("data: ", data);

    setIsSubmitting(true);

    try {
      await axios.post("/api/give-review", {
        classId: classIdtoGiveReview,
        ...data,
      });
      toast.success("Review submitted successfully");
    } catch (error) {
      console.error("Error submitting review", error);
    }

    finally {
      setIsSubmitting(false);
    }
    
  };

  return (
    <div className="min-h-screen p-6 bg-violet-950">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {user.name} ({user.type})
      </h1>

      {user.type === "teacher" && (
        <div className="mb-6">
          <div>
            <Link href="/dashboard/create-class">
              <Button>Create Class</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.length > 0 ? (
              classes.map((cls) => (
                <Card key={cls._id} className="shadow-lg">
                  <CardHeader>
                    <CardTitle>{cls.className}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Code:</strong> {cls.classCode}
                    </p>
                    <p>
                      <strong>Series:</strong> {cls.series}
                    </p>
                    <p>
                      <strong>Section:</strong> {cls.section}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-white">No classes yet.</p>
            )}
          </div>
        </div>
      )}

      {user.type === "student" && (
        <div className="mb-6 w-2/3 mx-auto">
          <Form {...formGiveReviewUsingClassId}>
            <form
              onSubmit={formGiveReviewUsingClassId.handleSubmit(
                GiveReviewofAClassusingId
              )}
              className=""
            >
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-blue-400">
                  Enter the class Id to give review
                </h1>
              </div>

              <FormField
                control={formGiveReviewUsingClassId.control}
                name="ClassId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-300">
                      Enter The CLass Id
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="/class/ID"
                        {...field}
                        className="bg-gray-900 text-blue-100 placeholder-blue-400 border border-blue-700 focus:border-blue-400 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
                      />
                    </FormControl>
                    <FormMessage className="text-blue-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-black font-semibold py-2 rounded-lg transition-all"
                disabled={isSubmitting}
              >
                Get Class"
              </Button>
            </form>
          </Form>

          {GiveReviewofId && (
            <div className="mt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {[
                    "clarity",
                    "engagement",
                    "fairness",
                    "materials",
                    "difficulty",
                    "teaching",
                    "courseQuality",
                    "learning",
                  ].map((fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName as keyof z.infer<typeof reviewSchema>}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="capitalize text-blue-300">
                            {fieldName}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"

                              min={1}
                              max={10}
                              placeholder="Rate from 1 to 10"
                              {...field}
                               onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              className="bg-gray-900 text-blue-100 placeholder-blue-400 border border-blue-700 focus:border-blue-400 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
                            />
                          </FormControl>
                          <FormMessage className="text-blue-400" />
                        </FormItem>
                      )}
                    />
                  ))}

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-300">
                          Additional Comments
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Write your feedback..."
                            {...field}
                            className="bg-gray-900 text-blue-100 placeholder-blue-400 border border-blue-700 focus:border-blue-400 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
                          />
                        </FormControl>
                        <FormMessage className="text-blue-400" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-black font-semibold py-2 rounded-lg transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Loading..." : "Submit Review"}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
