"use client";

import Button from "@/components/Button/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

export const avatarValues = [1, 2, 3, 4, 5, 6] as const;
const MINIMUM_USERNAME_LENGTH = 2;
const AddPlayerFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(MINIMUM_USERNAME_LENGTH, {
      message: `Name must be at least ${MINIMUM_USERNAME_LENGTH} characters!`,
    }),
  avatar: z.number({
    error: "Pick something!",
  }),
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
    reset,
  } = useForm<AddPlayerFormSchemaType>({
    resolver: zodResolver(AddPlayerFormSchema),
    defaultValues: {
      username: "",
      avatar: undefined,
    },
    mode: "onBlur",
  });

  const submitHandler = (data: { username: string; avatar: number }) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="form-wrapper | border-sun-300 border-1 p-4 rounded-lg bg-white self-center">
      <form
        className="form | gap-4 flex flex-col"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h2 className="font-heading text-center">Add player</h2>

        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <input
              className="border-1 border-sun-300 p-4 rounded-sm"
              {...field}
              placeholder="Enter a name..."
              data-valid={errors?.username ? "false" : "true"}
            />
          )}
        />

        {errors?.username?.message && <p>{errors?.username?.message}</p>}

        <Controller
          name="avatar"
          control={control}
          render={({ field, fieldState }) => (
            <fieldset aria-invalid={!!fieldState.error || undefined}>
              <legend className="mb-3">Choose an avatar</legend>

              <div className="flex gap-3">
                {avatarValues.map((option) => (
                  <label
                    key={option}
                    aria-label={`Avatar ${option}`}
                    className="cursor-pointer hover:opacity-85"
                  >
                    <input
                      type="radio"
                      value={option}
                      name={field.name}
                      checked={field.value === option}
                      onChange={() => field.onChange(option)}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      className="avatar-list-input | sr-only"
                    />
                    <img
                      src={`/avatar/${option}.svg`}
                      className="avatar-list-image"
                    />
                  </label>
                ))}
              </div>

              {fieldState.error && <p>{fieldState.error.message}</p>}
            </fieldset>
          )}
        />

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
