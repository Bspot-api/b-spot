# React i18next Setup

This project uses React i18next for internationalization. The setup includes automatic language detection, HTTP backend for loading translation files, and a language switcher component.

## Features

- **Automatic Language Detection**: Detects user's preferred language from browser settings
- **Language Persistence**: Saves language preference in localStorage
- **HTTP Backend**: Loads translation files dynamically from `/public/locales/`
- **Language Switcher**: UI component to change languages
- **Fallback Language**: English as fallback when translations are missing

## Usage

### Basic Translation

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <h1>{t('common.welcome')}</h1>;
};
```

### Using the Custom Hook

```tsx
import { useTranslations } from '../hooks/use-translations';

const MyComponent = () => {
  const { t, changeLanguage, currentLanguage } = useTranslations();
  
  return (
    <div>
      <p>Current language: {currentLanguage}</p>
      <button onClick={() => changeLanguage('fr')}>
        Switch to French
      </button>
      <h1>{t('common.welcome')}</h1>
    </div>
  );
};
```

### Language Switcher Component

```tsx
import { LanguageSwitcher } from './components/i18n/language-switcher';

const Header = () => {
  return (
    <header>
      <h1>My App</h1>
      <LanguageSwitcher />
    </header>
  );
};
```

## Translation Files

Translation files are located in `/public/locales/{language}/translation.json`.

### Structure

```json
{
  "common": {
    "welcome": "Welcome",
    "login": "Login"
  },
  "auth": {
    "email": "Email",
    "password": "Password"
  }
}
```

### Adding New Languages

1. Create a new folder in `/public/locales/{language_code}/`
2. Add a `translation.json` file with your translations
3. Update the `languages` array in `language-switcher.tsx`

## Configuration

The i18n configuration is in `/src/i18n/index.ts`. Key settings:

- **Fallback Language**: English (`en`)
- **Debug Mode**: Enabled in development
- **Language Detection**: localStorage → navigator → html tag
- **HTTP Backend**: Loads from `/locales/{{lng}}/{{ns}}.json`

## Best Practices

1. **Use Nested Keys**: Organize translations in logical groups (e.g., `common.welcome`, `auth.email`)
2. **Provide Fallbacks**: Always provide English translations as fallback
3. **Use Interpolation**: For dynamic values: `t('welcome', { name: 'John' })`
4. **Pluralization**: Use i18next's pluralization features for different counts
5. **Namespace**: Use namespaces for large applications to split translation files

## Available Languages

- English (`en`) - Default
- French (`fr`)

To add more languages, update the `languages` array in the `LanguageSwitcher` component and create corresponding translation files. 