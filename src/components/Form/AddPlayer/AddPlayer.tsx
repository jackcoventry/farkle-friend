"use client";

import Button from "@/components/Button/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

const AddPlayerFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(5, { message: "Username must be at least 2 characters!" }),
});

export type AddPlayerFormSchemaType = z.infer<typeof AddPlayerFormSchema>;
export type AddPlayerFormResult = {
  message: string;
};

type AddPlayerFormProps = {
  onSubmit: SubmitHandler<AddPlayerFormSchemaType>;
};

function AddPlayerForm({ onSubmit }: Readonly<AddPlayerFormProps>) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddPlayerFormSchemaType>({
    resolver: zodResolver(AddPlayerFormSchema),
    defaultValues: {
      username: "",
    },
    mode: "all",
  });

  return (
    <div className="form-wrapper | border-sun-300 border-1 p-4 rounded-lg">
      <form
        className="form | gap-4 flex flex-col"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="font-heading">Add player</h2>

        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <input
              className="border-1 border-sun-300 p-4 rounded-sm"
              {...field}
              placeholder="Type something..."
              data-valid={errors?.username ? "false" : "true"}
            />
          )}
        />

        {errors?.username?.message && <p>{errors?.username?.message}</p>}

        <Button
          type="submit"
          className="justify-center"
          icon="plus"
          iconPosition="right"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

export default AddPlayerForm;
