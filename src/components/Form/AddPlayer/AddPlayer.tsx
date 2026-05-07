'use client';

import { useI18n } from '@/i18n/I18nProvider';
import { translateValidationMessage } from '@/i18n/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useGame } from '@/domain/game/GameProvider';
import { avatarSet, avatarValues } from '@/domain/game/avatars';
import { AddPlayerFormSchema, type AddPlayerFormSchemaType } from '@/domain/game/formSchemas';
import { AvatarImage } from '@/components/AvatarImage/AvatarImage';
import Button from '@/components/Button/Button';
import { Panel } from '@/components/Panel/Panel';

export type { AddPlayerFormSchemaType };
export type AddPlayerFormResult = {
  message: string;
};

type AddPlayerFormProps = {
  onSubmit: SubmitHandler<AddPlayerFormSchemaType>;
};

function getNextDefaultUsername(players: { username: string }[]) {
  const existingNames = new Set(players.map((player) => player.username.trim().toLowerCase()));
  let playerNumber = players.length + 1;

  while (existingNames.has(`player #${playerNumber}`)) {
    playerNumber += 1;
  }

  return `Player #${playerNumber}`;
}

function AddPlayerForm({ onSubmit }: Readonly<AddPlayerFormProps>) {
  const { state } = useGame();
  const { t } = useI18n();
  const defaultUsername = getNextDefaultUsername(state.players);
  const {
    control,
    handleSubmit,
    formState: { dirtyFields, errors },
    reset,
    setError,
    setValue,
  } = useForm<AddPlayerFormSchemaType>({
    resolver: zodResolver(AddPlayerFormSchema),
    defaultValues: {
      username: defaultUsername,
      avatar: 1,
    },
    mode: 'onBlur',
  });

  const avatarsInUse = state.players.reduce((acc: number[], currentItem) => {
    acc.push(currentItem?.avatar);
    return acc;
  }, []);
  const maxPlayersReached = Boolean(state.players.length === 6);

  useEffect(() => {
    if (dirtyFields.username) return;

    setValue('username', defaultUsername);
  }, [defaultUsername, dirtyFields.username, setValue]);

  const submitHandler = (data: { username: string; avatar: number }) => {
    const duplicateName = state.players.some(
      (player) => player.username.trim().toLowerCase() === data.username.trim().toLowerCase()
    );

    if (duplicateName) {
      setError('username', {
        message: 'validation.duplicatePlayerName',
        type: 'validate',
      });
      return;
    }

    onSubmit(data);
    reset({
      username: '',
      avatar: data.avatar,
    });
    const nextAvailableAvatar =
      avatarValues.find((avatar) => avatar !== data.avatar && !avatarsInUse.includes(avatar)) ?? 1;
    setValue('avatar', nextAvailableAvatar);
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
                  <label
                    htmlFor="player-name"
                    className="sr-only"
                  >
                    Player name
                  </label>
                  <input
                    id="player-name"
                    className="field-control"
                    {...field}
                    placeholder="Enter player name..."
                    onFocus={(event) => {
                      if (!dirtyFields.username && event.currentTarget.value === defaultUsername) {
                        event.currentTarget.select();
                      }
                    }}
                    data-valid={errors?.username ? 'false' : 'true'}
                    aria-invalid={errors?.username ? 'true' : undefined}
                    aria-describedby={errors?.username ? 'player-name-error' : undefined}
                  />
                  {errors?.username ? (
                    <p
                      id="player-name-error"
                      className="field-error"
                      role="alert"
                    >
                      {translateValidationMessage(t, errors.username.message)}
                    </p>
                  ) : null}
                </>
              )}
            />

            <Controller
              name="avatar"
              control={control}
              render={({ field, fieldState }) => (
                <fieldset
                  aria-describedby={fieldState.error ? 'player-avatar-error' : undefined}
                  aria-invalid={!!fieldState.error || undefined}
                >
                  <legend className="mb-4 text-text">Choose an avatar</legend>

                  <div className="avatar-list-grid | grid grid-cols-3 justify-items-center gap-3 sm:gap-4">
                    {avatarValues.map((option) => {
                      const avatar = avatarSet[option];
                      const isAvatarInUse = avatarsInUse.includes(option);
                      const classes = `avatar-list-image | cursor-pointer enabled:hover:opacity-85 rounded-full overflow-hidden flex items-center justify-center ${avatar.color}`;
                      return (
                        <label
                          key={option}
                          aria-label={`Avatar ${avatar.name}${isAvatarInUse ? ' unavailable' : ''}`}
                          className="avatar-list-option | hover:scale-105 transition-transform"
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

                  {fieldState.error ? (
                    <p
                      id="player-avatar-error"
                      className="field-error"
                      role="alert"
                    >
                      {translateValidationMessage(t, fieldState.error.message)}
                    </p>
                  ) : null}
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
