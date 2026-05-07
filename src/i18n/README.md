# i18n

This project uses a small static-first i18n layer instead of route middleware or a server dependency.

- Add supported locales in `locales.ts`.
- Add translated copy in `messages.ts`. English is the fallback shape and should contain every key.
- Read copy in client components with `const { t } = useI18n()`.
- Use interpolation with named values:

```tsx
t('scoreGenerator.addDie', { value: die })
```

Language is stored as `state.preferences.locale`, persisted with the other preferences, and reflected on
`document.documentElement.lang`.
