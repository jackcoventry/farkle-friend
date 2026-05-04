"use client";

import { AvatarImage } from "@/components/AvatarImage/AvatarImage";
import Button from "@/components/Button/Button";
import { Panel } from "@/components/Panel/Panel";
import { useGame } from "@/domain/game/GameProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

export const avatarValues = [1, 2, 3, 4, 5, 6] as const;

type AvatarInfo = {
  name: string;
  color: string;
  image: string;
};

export const avatarSet = {
  1: { name: "Burger", color: "bg-red-500", image: "/avatar/food/burger.svg" },
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
  4: { name: "Pie", color: "bg-orange-500", image: "/avatar/food/pie.svg" },
  5: {
    name: "Sandwich",
    color: "bg-yellow-500",
    image: "/avatar/food/sandwich.svg",
  },
  6: { name: "Soup", color: "bg-purple-500", image: "/avatar/food/soup.svg" },
} as const satisfies Record<number, AvatarInfo>;

export type AvatarSet = typeof avatarSet;
export type AvatarId = keyof typeof avatarSet & number;

const MINIMUM_USERNAME_LENGTH = 1;
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
    setError,
    setValue,
  } = useForm<AddPlayerFormSchemaType>({
    resolver: zodResolver(AddPlayerFormSchema),
    defaultValues: {
      username: "",
      avatar: 1,
    },
    mode: "onBlur",
  });

  const { state } = useGame();
  const avatarsInUse = state.players.reduce((acc: number[], currentItem) => {
    acc.push(currentItem?.avatar);
    return acc;
  }, []);
  const maxPlayersReached = Boolean(state.players.length === 6);
  const submitHandler = (data: { username: string; avatar: number }) => {
    const duplicateName = state.players.some(
      (player) =>
        player.username.trim().toLowerCase() ===
        data.username.trim().toLowerCase(),
    );

    if (duplicateName) {
      setError("username", {
        message: "That player name is already in use.",
        type: "validate",
      });
      return;
    }

    onSubmit(data);
    reset();
    const nextAvailableAvatar =
      avatarValues.find(
        (avatar) => avatar !== data.avatar && !avatarsInUse.includes(avatar),
      ) ?? 1;
    setValue("avatar", nextAvailableAvatar);
  };

  return (
    <Panel className="form-wrapper | self-center">
      <form
        className="form | gap-6 flex flex-col"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h2>Add Player</h2>
        {!maxPlayersReached && (
          <>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <>
                  <label htmlFor="player-name" className="sr-only">
                    Player name
                  </label>
                  <input
                    id="player-name"
                    className={`py-4 px-5 border border-gray-300 bg-gray-600 rounded-4xl placeholder-white text-white`}
                    {...field}
                    placeholder="Enter player name..."
                    data-valid={errors?.username ? "false" : "true"}
                    aria-invalid={errors?.username ? "true" : undefined}
                    aria-describedby={
                      errors?.username ? "player-name-error" : undefined
                    }
                  />
                  {errors?.username ? (
                    <p
                      id="player-name-error"
                      className="text-red-800 px-4 py-2 bg-white border-red-500 border rounded-3xl"
                    >
                      {errors.username.message}
                    </p>
                  ) : null}
                </>
              )}
            />

            <Controller
              name="avatar"
              control={control}
              render={({ field, fieldState }) => (
                <fieldset aria-invalid={!!fieldState.error || undefined}>
                  <legend className="mb-4 text-white">Choose an avatar</legend>

                  <div className="gap-4 grid grid-cols-3 justify-items-center">
                    {avatarValues.map((option) => {
                      const avatar = avatarSet[option];
                      const isAvatarInUse = avatarsInUse.includes(option);
                      const classes = `avatar-list-image | cursor-pointer enabled:hover:opacity-85 rounded-full overflow-hidden w-[100px] h-[100px] p-4 flex items-center justify-center ${avatar.color}`;
                      return (
                        <label
                          key={option}
                          aria-label={`Avatar ${avatar.name}${
                            isAvatarInUse ? " unavailable" : ""
                          }`}
                          className="w-[100px] hover:scale-105 transition-transform"
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
                            disabled={isAvatarInUse}
                          />
                          <div className={classes}>
                            <AvatarImage
                              avatar={avatar}
                              alt={`Avatar ${avatar.name}`}
                              className="h-auto w-full"
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
              disabled={maxPlayersReached}
            >
              Add
            </Button>
          </>
        )}
      </form>
    </Panel>
  );
}

export default AddPlayerForm;
