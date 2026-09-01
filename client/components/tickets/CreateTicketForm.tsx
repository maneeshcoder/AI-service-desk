"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateTicket } from "@/hooks/useTicket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const createTicketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type CreateTicketForm = z.infer<typeof createTicketSchema>;

export function CreateTicketForm({ onSuccess }: { onSuccess?: () => void }) {
  const createTicket = useCreateTicket();
  const [serverError, setServerError] = useState<string | null>(null);
  const [duplicates, setDuplicates] = useState<{ title: string; similarity: number }[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTicketForm>({ resolver: zodResolver(createTicketSchema) });

  async function onSubmit(data: CreateTicketForm) {
    setServerError(null);
    try {
      const result = await createTicket.mutateAsync(data);
      if (result.potentialDuplicates?.length) {
        setDuplicates(result.potentialDuplicates);
      } else {
        reset();
        onSuccess?.();
      }
    } catch (err: any) {
      setServerError(err?.response?.data?.message ?? "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Can't connect to VPN" {...register("title")} />
        {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={4}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="What's happening, and what have you already tried?"
          {...register("description")}
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
      </div>

      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {serverError}
        </p>
      )}
      {duplicates.length > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 space-y-1.5">
          <p className="text-sm font-medium text-amber-800">Similar tickets found:</p>
          {duplicates.map((d, i) => (
            <p key={i} className="text-sm text-amber-700">
              {d.title} ({Math.round(d.similarity * 100)}% match)
            </p>
          ))}
          <p className="text-xs text-amber-600">Your ticket was created anyway — a support engineer will review it.</p>
        </div>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit ticket"}
      </Button>
    </form>
  );
}