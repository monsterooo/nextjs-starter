"use client";

import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { forgetPassword } from "@/lib/actions/auth";
import { forgetSchema } from "@/lib/validations/auth";
import ErrorMessage from "../message/error-message";
import SuccessMessage from "../message/success-message";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

const ForgetPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const form = useForm<z.infer<typeof forgetSchema>>({
    resolver: zodResolver(forgetSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof forgetSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      forgetPassword(values).then((data) => {
        setError(data?.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="example@gmail.com"
                    type="email"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="mt-2">
            <ErrorMessage message={error} />
          </div>
          <div className="mt-2">
            <SuccessMessage message={success} />
          </div>
          <div className="mt-2">
            <Button className="w-full" type="submit" disabled={isPending}>
              Send reset email
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgetPasswordForm;
