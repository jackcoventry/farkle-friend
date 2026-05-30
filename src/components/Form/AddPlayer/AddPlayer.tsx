'use client';

import { useI18n } from '@/i18n/I18nProvider';
import { translateValidationMessage } from '@/i18n/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useGame } from '@/domain/game/GameProvider';
import { avatarSet, avatarValues } from '@/domain/game/avatars';
import { AddPlayerFormSchema, type AddPlayerFormSchemaType } from '@/domain/game/formSchemas';
import { AvatarImage } from '@/components/AvatarImage/AvatarImage';
import { Button } from '@/components/Button/Button';
import { Panel } from '@/components/Panel/Panel';
import './AddPlayer.css';

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

  return playerNumber;
}

export function AddPlayerForm({ onSubmit }: Readonly<AddPlayerFormProps>) {
  const { state } = useGame();
  const { t } = useI18n();
  const avatarListRef = useRef<HTMLDivElement | null>(null);
  const defaultUsername = t('player.defaultName', {
    number: getNextDefaultUsername(state.players),
  });
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

  useLayoutEffect(() => {
    const resetAvatarListScroll = () => {
      if (!avatarListRef.current) return;

      avatarListRef.current.scrollLeft = 0;
    };

    resetAvatarListScroll();
    window.addEventListener('pageshow', resetAvatarListScroll);
    const animationFrameId = window.requestAnimationFrame(resetAvatarListScroll);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pageshow', resetAvatarListScroll);
    };
  }, []);

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
        className="form | gap-sm lg:gap-xl flex flex-col"
        autoComplete="off"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h2>{t('player.add')}</h2>
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
                    {t('player.name')}
                  </label>
                  <input
                    id="player-name"
                    className="field-control"
                    autoComplete="off"
                    {...field}
                    placeholder={t('player.namePlaceholder')}
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
                  className="avatar-list-fieldset"
                  aria-describedby={fieldState.error ? 'player-avatar-error' : undefined}
                  aria-invalid={!!fieldState.error || undefined}
                >
                  <legend className="text-text mb-md">{t('player.chooseAvatar')}</legend>

                  <div
                    ref={avatarListRef}
                    className="avatar-list-grid"
                  >
                    {avatarValues.map((option) => {
                      const avatar = avatarSet[option];
                      const isAvatarInUse = avatarsInUse.includes(option);
                      const classes = `avatar-list-image | cursor-pointer enabled:hover:opacity-85 rounded-full overflow-hidden flex items-center justify-center ${avatar.swatchClassName}`;
                      return (
                        <label
                          key={option}
                          aria-label={t(
                            isAvatarInUse ? 'player.avatarUnavailable' : 'player.avatarLabel',
                            { avatar: avatar.name }
                          )}
                          className="avatar-list-option | transition-transform hover:scale-105"
                        >
                          <input
                            type="radio"
                            value={option}
                            name={field.name}
                            checked={field.value === option}
                            onChange={() => field.onChange(option)}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            className="avatar-list-input"
                            autoComplete="off"
                            disabled={isAvatarInUse}
                          />
                          <div className={classes}>
                            <AvatarImage
                              avatar={avatar}
                              alt={t('player.avatarAlt', { avatar: avatar.name })}
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
