"use client";

import { AvatarImage } from "@/components/AvatarImage/AvatarImage";
import Button from "@/components/Button/Button";
import { canStartGame } from "@/domain/game/gameLogic";
import { useGame } from "@/domain/game/GameProvider";
import { formatScore } from "@/utils/formatScore";
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

  const { state, dispatch } = useGame();
  const avatarsInUse = state.players.reduce((acc: number[], currentItem) => {
    acc.push(currentItem?.avatar);
    return acc;
  }, []);
  const maxPlayersReached = Boolean(state.players.length === 6);
  const submitHandler = (data: { username: string; avatar: number }) => {
    const duplicateName = state.players.some(
      (player) =>
        player.username.trim().toLowerCase() ===
        data.username.trim().toLowerCase()
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
        (avatar) => avatar !== data.avatar && !avatarsInUse.includes(avatar)
      ) ?? 1;
    setValue("avatar", nextAvailableAvatar);
  };

  const readyToStart = Boolean(canStartGame(state));
  const modeLabel =
    state.settings.mode === "dice" ? "Dice rolling" : "Manual scoring";
  const playerCount = state.players.length;

  const onStartGame = () => {
    dispatch({ type: "START_GAME" });
  };

  return (
    <div className="form-wrapper | border-sun-300 border-1 p-6 rounded-lg bg-white self-center">
      <form
        className="form | gap-6 flex flex-col"
        onSubmit={handleSubmit(submitHandler)}
      >
        {!maxPlayersReached && (
          <>
            <h2 className="font-heading text-center">Add player</h2>
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
                    className={`border-1 py-4 px-5 rounded-4xl ${errors?.username ? "border-red-500" : "border-gray-800"}`}
                    {...field}
                    placeholder="Enter your name..."
                    data-valid={errors?.username ? "false" : "true"}
                    aria-invalid={errors?.username ? "true" : undefined}
                    aria-describedby={
                      errors?.username ? "player-name-error" : undefined
                    }
                  />
                  {errors?.username ? (
                    <p id="player-name-error" className="text-red-700">
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
                  <legend className="mb-4">Choose an avatar</legend>

                  <div className="flex gap-4 grid grid-cols-3">
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

        <section className="grid gap-3 rounded-lg bg-sun-50 p-4">
          <div>
            <h3 className="font-heading-2">Ready?</h3>
            <p className="text-gray-800">
              {readyToStart
                ? `${playerCount} players · ${modeLabel} · First to ${formatScore(
                    state.settings.targetScore
                  )}`
                : "Add at least two players to start."}
            </p>
          </div>
          <Button
            type="button"
            onClick={onStartGame}
            className="w-full justify-center"
            disabled={!readyToStart}
          >
            Start game
          </Button>
        </section>
      </form>
    </div>
  );
}

export default AddPlayerForm;
