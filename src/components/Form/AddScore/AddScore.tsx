"use client";

import Button from "@/components/Button/Button";
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
    <div className="form-wrapper | border-sun-300 border-1 p-4 rounded-lg">
      <form
        className="form | gap-4 flex flex-col"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h2 className="font-heading">Add score</h2>

        <Controller
          name="value"
          control={control}
          render={({ field }) => (
            <input
              className="border-1 border-sun-300 p-4 rounded-sm"
              {...field}
              placeholder="Enter your score..."
              data-valid={errors?.value ? "false" : "true"}
              type="number"
              onChange={(value) => field.onChange(value.target.valueAsNumber)}
            />
          )}
        />

        {errors?.value?.message && <p>{errors?.value?.message}</p>}

        <Button
          type="submit"
          className="justify-center"
          icon="plus"
          iconPosition="right"
        >
          Submit score
        </Button>
      </form>
    </div>
  );
}

export default AddScoreForm;
