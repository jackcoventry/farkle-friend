"use client";

import RichButton from "@/components/RichButton/RichButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

const AddScoreSchema = z.object({
  value: z.number().min(0, {
    message: `Enter a valid number, or zero if you were farkled!`,
  }),
});

export type AddScoreSchemaType = z.infer<typeof AddScoreSchema>;
export type AddScoreFormResult = {
  message: string;
};

type AddScoreFormProps = {
  onSubmit: SubmitHandler<AddScoreSchemaType>;
};

function AddScoreForm({ onSubmit }: Readonly<AddScoreFormProps>) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddScoreSchemaType>({
    resolver: zodResolver(AddScoreSchema),
    defaultValues: {
      value: 0,
    },
    mode: "onBlur",
  });

  const submitHandler = (data: { value: number }) => {
    onSubmit(data);
    reset();
  };

  return (
    <form
      className="turn-frame | grid gap-3 h-full"
      onSubmit={handleSubmit(submitHandler)}
    >
      <div>
        <h2 className="text-white font-heading">Enter your score below!</h2>
      </div>

      <div className="flex items-center">
        <Controller
          name="value"
          control={control}
          render={({ field }) => (
            <input
              className="border-0 border-b-2 p-4 text-white font-mega w-full text-center appearance-none"
              {...field}
              placeholder="Enter your score..."
              data-valid={errors?.value ? "false" : "true"}
              type="number"
              onChange={(value) => field.onChange(value.target.valueAsNumber)}
            />
          )}
        />
      </div>

      <div className="w-full flex justify-center">
        <RichButton type="submit" className="justify-center" icon="dice">
          Submit score
        </RichButton>
      </div>
    </form>
  );
}

export default AddScoreForm;
