import type { ConfigContext, ExpoConfig } from 'expo/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const appJson = require('./app.json') as { expo: ExpoConfig };

type AppVariant = 'development' | 'production';

function getVariant(): AppVariant {
  return process.env.APP_VARIANT === 'development' ? 'development' : 'production';
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const base = appJson.expo;
  const variant = getVariant();
  const isDev = variant === 'development';

  const scheme = isDev ? 'bspot-dev' : base.scheme ?? 'bspot';
  const name = isDev ? 'B-Spot Dev' : base.name ?? 'B-Spot';
  const iosBundleIdentifier = isDev
    ? `${base.ios?.bundleIdentifier ?? 'com.bspot.mobile'}.dev`
    : base.ios?.bundleIdentifier;
  const androidPackage = isDev
    ? `${base.android?.package ?? 'com.bspot.mobile'}.dev`
    : base.android?.package;

  return {
    ...base,
    ...config,
    name,
    scheme,
    ios: {
      ...base.ios,
      ...config.ios,
      bundleIdentifier: iosBundleIdentifier,
    },
    android: {
      ...base.android,
      ...config.android,
      package: androidPackage,
    },
    extra: {
      ...base.extra,
      ...config.extra,
      appVariant: variant,
    },
  };
};
