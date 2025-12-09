"use client";

import Button from "@/components/Button/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

export const avatarValues = [1, 2, 3, 4, 5, 6] as const;

type AvatarSet = {
  [key in (typeof avatarValues)[number]]: {
    name: string;
    color: string;
    image: string;
  };
};

export const avatarSet = {
  1: {
    name: "Burger",
    color: "bg-red-500",
    image: "/avatar/food/burger.svg",
  },
  2: {
    name: "Hot dog",
    color: "bg-blue-500",
    image: "/avatar/food/hotdog.svg",
  },
  3: {
    name: "Noodles",
    color: "bg-green-500",
    image: "/avatar/food/noodles.svg",
  },
  4: {
    name: "Pie",
    color: "bg-orange-500",
    image: "/avatar/food/pie.svg",
  },
  5: {
    name: "Sandwich",
    color: "bg-yellow-500",
    image: "/avatar/food/sandwich.svg",
  },
  6: {
    name: "Soup",
    color: "bg-purple-500",
    image: "/avatar/food/soup.svg",
  },
} as AvatarSet;

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

              <div className="flex gap-3 grid grid-cols-3">
                {avatarValues.map((option) => {
                  const avatar = avatarSet[option];
                  const classes = `avatar-list-image | cursor-pointer hover:opacity-85 rounded-full overflow-hidden w-[100px] h-[100px] p-4 flex items-center justify-center ${avatar.color}`;
                  return (
                    <label key={option} aria-label={`Avatar ${avatar.name}`}>
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
                      <div className={classes}>
                        <img
                          src={avatar.image}
                          alt={`Avatar ${avatar.name}`}
                          className="w-dvh"
                        />
                      </div>
                    </label>
                  );
                })}
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
