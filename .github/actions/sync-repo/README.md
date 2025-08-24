# Sync Repository Action

This action synchronizes a private repository folder to a public repository, handling the conversion from a monorepo structure to a standalone repository.

## Usage

```yaml
- name: Sync Repository
  uses: ./.github/actions/sync-repo
  with:
    source-folder: 'frontend'  # or 'api'
    public-repo: 'Bspot-api/b-spot-frontend'  # or 'Bspot-api/b-spot-api'
    sync-token: ${{ secrets.FRONTEND_SYNC_TOKEN }}  # or API_SYNC_TOKEN
    target-branch: 'develop'  # or 'main'
    source-branch: 'feat/add-version'  # optional, for logging
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `source-folder` | Source folder to sync (e.g., frontend, api) | ✅ | - |
| `public-repo` | Public repository name (e.g., Bspot-api/b-spot-frontend) | ✅ | - |
| `sync-token` | GitHub token for public repository access | ✅ | - |
| `target-branch` | Target branch on public repository (develop or main) | ✅ | - |
| `source-branch` | Source branch name for logging | ❌ | 'feature' |

## What it does

1. **Clones the public repository** using the provided token
2. **Checks out the target branch** (develop or main)
3. **Cleans the repository** (removes all files except .git)
4. **Copies source files** from the specified folder
5. **Adapts configuration** for standalone repository:
   - Creates `pnpm-workspace.yaml`
   - Modifies `package.json` scripts
   - Removes workspace-specific scripts
6. **Commits and pushes** changes if any are detected
7. **Cleans up** temporary files

## Special handling

- **API**: Automatically copies `docker-compose.yml` and sets `dev` script to `start:dev`
- **Frontend**: Standard configuration adaptation
- **Root files**: Always copies `package.json`, `tsconfig.json`, and `.gitignore`

## Example workflows

See `sync-frontend.yml` and `sync-api.yml` for complete usage examples.
