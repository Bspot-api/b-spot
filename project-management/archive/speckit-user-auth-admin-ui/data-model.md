# Data Model: User Authentication & Conditional Admin UI

**Feature**: `feat/user-auth-admin-ui`
**Date**: 2026-06-09

---

## No new database tables

All data needed for this feature already exists in the database:

- `user` — Better-Auth managed; contains `id`, `email`, `name`
- `session` — Better-Auth managed; links to `user`
- `admins` — `id`, `userId` (FK → user), `createdAt`
- `brand_suggestion` — `id`, `brandName`, `barcode?`, `productName?`, `productImageUrl?`, `notes?`, `offBrandRaw?`, `status`, `createdAt`, `updatedAt`

---

## New API DTOs

### `ListBrandSuggestionsQueryDto` (API — `apps/api/src/modules/auth/dto/admin.dto.ts`)

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `status` | `'new' \| 'reviewed' \| 'approved' \| 'rejected'` | No | `@IsOptional()`, `@IsEnum(BrandSuggestionStatus)` |

### `UpdateBrandSuggestionStatusDto` (API — `apps/api/src/modules/auth/dto/admin.dto.ts`)

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `status` | `'new' \| 'reviewed' \| 'approved' \| 'rejected'` | Yes | `@IsEnum(BrandSuggestionStatus)`, `@IsNotEmpty()` |

### `BrandSuggestionListDto` (API — `apps/api/src/modules/auth/dto/admin.dto.ts`)

| Field | Type | Notes |
|-------|------|-------|
| `items` | `BrandSuggestionDto[]` | Imported from `brand-suggestion` module |
| `total` | `number` | Count of items returned (enables future pagination) |

---

## New Mobile Types

### `SessionDto` (mobile — `apps/mobile/src/api/types.ts`)

```ts
export interface SessionDto {
  user: {
    id: string;
    email: string;
    name: string;
  };
}
```

### `AdminProfileDto` (mobile — `apps/mobile/src/api/types.ts`)

```ts
export interface AdminProfileDto {
  adminId: string;
  userId: string;
  email: string;
  name: string;
  promotedAt: string;
}
```

### `BrandSuggestionListDto` (mobile — `apps/mobile/src/api/types.ts`)

```ts
export interface BrandSuggestionListDto {
  items: BrandSuggestionDto[];
  total: number;
}
```

### `UpdateSuggestionStatusDto` (mobile — `apps/mobile/src/api/types.ts`)

```ts
export type SuggestionStatus = 'new' | 'reviewed' | 'approved' | 'rejected';

export interface UpdateSuggestionStatusDto {
  status: SuggestionStatus;
}
```

---

## Auth feature types (mobile — `apps/mobile/src/features/auth/types.ts`)

```ts
export interface Session {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface AdminProfile {
  adminId: string;
  userId: string;
  email: string;
  name: string;
  promotedAt: string;
}
```

These mirror `SessionDto` and `AdminProfileDto` from `api/types.ts` but live in the feature module to keep domain types separate from raw API contracts.

---

## BrandSuggestion state transitions

```
       [new]
      /     \
[reviewed]  [rejected]
      \
   [approved]
```

All transitions are allowed from the UI in this MVP (no terminal states enforced client-side). Server validates the `status` enum value.

---

## Service method signatures (new — `apps/api/src/modules/brand-suggestion/brand-suggestion.service.ts`)

```ts
async findByStatus(
  status?: BrandSuggestionStatus,
): Promise<{ items: BrandSuggestion[]; total: number }>

async updateStatus(
  id: number,
  status: BrandSuggestionStatus,
): Promise<BrandSuggestion>
```

`findByStatus` with no argument returns all suggestions. With a status argument, filters by that status. Results ordered by `createdAt DESC`.
