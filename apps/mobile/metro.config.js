const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = Array.from(new Set([...(config.watchFolders ?? []), workspaceRoot]));
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// e2e only (`pnpm e2e:mobile` sets the variable on its own Metro). In
// development Expo bundles apps/mobile/.env* as modules whose values win over
// Metro's process env (@expo/metro-config's transform worker lists them with
// `require.context`, from Metro's file map). Blocking them keeps them out of
// that map, so the bundle uses the e2e EXPO_PUBLIC_API_URL. Relies on Expo
// internals; apps/e2e/env/ios/bundle-preflight.ts fails loudly if that changes.
if (process.env.B_SPOT_E2E_IGNORE_DOTENV_FILES === '1') {
  const escapedRoot = projectRoot.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  config.resolver.blockList = [].concat(
    config.resolver.blockList ?? [],
    new RegExp(`^${escapedRoot}/\\.env`),
  );
}

module.exports = withNativeWind(config, { input: './global.css' });
