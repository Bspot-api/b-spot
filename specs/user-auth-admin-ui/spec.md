# Feature Specification: User Authentication & Conditional Admin UI

**Feature Branch**: `feat/user-auth-admin-ui`
**Created**: 2026-06-09
**Status**: Draft
**Input**: User description: "Auth utilisateur + UI conditionnelle admin"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Magic Link Login (Priority: P1)

A user who is not logged in wants to authenticate. They navigate to the login screen, enter their email address, and receive a magic link by email. When they click the link on any device, their session is established and the app reflects their authenticated state — without requiring any additional action.

**Why this priority**: Authentication is the prerequisite for every other story in this feature. Without it, nothing else works.

**Independent Test**: Can be fully tested by entering an email, receiving a magic link, clicking it, and verifying the app transitions from unauthenticated to authenticated state.

**Acceptance Scenarios**:

1. **Given** the user is not logged in, **When** they navigate to the login screen, **Then** they see an email field and a "Receive a login link" button.
2. **Given** the user has entered a valid email, **When** they tap the button, **Then** they see a confirmation message "Check your inbox" with no automatic redirect.
3. **Given** the user has received the magic link email, **When** they tap the link, **Then** their session is established and the app reflects their authenticated status on the next relevant interaction (navigation, refresh, or foreground resume).
4. **Given** the user is already logged in, **When** they navigate to the login screen, **Then** they are redirected to the previous screen immediately.

---

### User Story 2 - Admin Detection After Login (Priority: P1)

After login, the app silently checks whether the authenticated user has admin privileges. If they do, an Admin section appears in the app navigation. If not, the app behaves exactly as it would for any standard user — no visible difference, no error displayed.

**Why this priority**: This is the core of the "conditional admin UI" feature. It must work correctly and silently for all users.

**Independent Test**: Can be tested by logging in with an admin account and verifying the Admin tab appears, then logging in with a non-admin account and verifying it does not.

**Acceptance Scenarios**:

1. **Given** the user is logged in as an admin, **When** the app checks their role, **Then** an Admin tab appears in the bottom navigation.
2. **Given** the user is logged in but is not an admin, **When** the app checks their role, **Then** no Admin tab appears and the app functions normally.
3. **Given** the user is not logged in, **When** the app loads, **Then** no Admin tab appears.
4. **Given** the admin is logged in and the Admin tab is visible, **When** they reload the web app or reopen the mobile app, **Then** the Admin tab is still visible without requiring a new login.

---

### User Story 3 - Admin Dashboard Overview (Priority: P2)

An admin user opens the Admin tab and sees a summary of pending brand suggestion activity: counts of suggestions grouped by status (new, reviewed, approved, rejected). They can tap any status counter to navigate to the filtered list of suggestions for that status.

**Why this priority**: Provides the admin's primary entry point for managing brand suggestion content. Depends on Story 2.

**Independent Test**: Can be tested independently by navigating to the Admin tab and verifying the counters display and each is tappable to reach a filtered list.

**Acceptance Scenarios**:

1. **Given** the admin is on the Admin screen, **When** the screen loads, **Then** they see their name and email, and four status counters: new, reviewed, approved, rejected.
2. **Given** the admin is on the Admin screen, **When** they tap a status counter, **Then** they navigate to the suggestions list filtered to that status.
3. **Given** the admin is on the Admin screen, **When** they tap the Sign Out button, **Then** their session is terminated, the Admin tab disappears, and they are returned to the unauthenticated state.

---

### User Story 4 - Brand Suggestion Review (Priority: P2)

An admin reviews the list of brand suggestions and can change their status (approve, reject, or mark as reviewed). Destructive actions (rejection) require a confirmation step.

**Why this priority**: This is the core administrative workflow for managing brand data quality.

**Independent Test**: Can be tested by navigating to the suggestions list, performing status changes, and verifying the item status updates immediately in the list.

**Acceptance Scenarios**:

1. **Given** the admin is on the suggestions list, **When** the list loads, **Then** each item shows brand name, product name (if available), barcode (if available), product image (if available), and creation date.
2. **Given** the admin is viewing a "new" suggestion, **When** they tap "Approve", **Then** the suggestion status changes to "approved" and the item moves out of the current filtered view.
3. **Given** the admin is viewing a suggestion, **When** they tap "Reject", **Then** a confirmation dialog appears; upon confirmation, status changes to "rejected".
4. **Given** the admin is viewing a "new" suggestion, **When** they tap "Mark as Reviewed", **Then** the suggestion status changes to "reviewed".
5. **Given** the admin is on the suggestions list, **When** they switch filter tabs at the top, **Then** the list updates to show only suggestions matching the selected status.

---

### User Story 5 - Session Expiry Handling (Priority: P3)

If the user's session expires while they are actively using the app, they are notified and redirected to the login screen without losing context abruptly.

**Why this priority**: Graceful degradation after session loss is important for trust but is not a blocking requirement for the core feature.

**Independent Test**: Can be tested by simulating a session expiry during app use and verifying a notification appears and the user is redirected to the login screen.

**Acceptance Scenarios**:

1. **Given** the user is authenticated and using the app, **When** their session expires and a protected action is attempted, **Then** a toast notification appears informing them their session has expired.
2. **Given** the session has expired, **When** the toast appears, **Then** the user is automatically redirected to the login screen.

---

### Edge Cases

- What happens if the user taps "Receive a login link" multiple times in quick succession? Each tap sends a new link; the most recent link is valid.
- What happens if the user opens the magic link on a different device than the one they entered their email on? The session is established on the device where the link was opened.
- What happens if there are zero brand suggestions in a given status? The counter shows 0 and tapping it shows an empty list with a "No suggestions" message.
- What happens if the admin role check fails due to a network error (not a 403)? Assume non-admin silently; retry on next app focus — no error is shown to the user.
- What happens if the suggestions list fails to load? Show an error state with a retry option.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST provide a login screen accessible from the profile/settings area, even when the user is not authenticated.
- **FR-002**: The login screen MUST allow users to enter an email address and request a magic link.
- **FR-003**: After submitting a login request, the app MUST display a confirmation message and remain on the same screen — no automatic redirect.
- **FR-004**: The app MUST detect the authenticated session state on startup, foreground resume, and after navigation events.
- **FR-005**: After authentication, the app MUST silently check whether the user has admin privileges using a single, cached check — not on every render.
- **FR-006**: The admin privilege check result MUST be cached for at least 5 minutes to avoid redundant network calls.
- **FR-007**: The Admin tab in bottom navigation MUST only be visible when the current user is confirmed as an admin.
- **FR-008**: The Admin screen MUST display the admin's name, email, and suggestion counts grouped by status (new, reviewed, approved, rejected).
- **FR-009**: Each status counter on the Admin screen MUST be tappable and navigate to the suggestions list filtered to that status.
- **FR-010**: The suggestions list MUST display brand name, product name (if present), barcode (if present), product image (if present), and creation date for each item.
- **FR-011**: Each suggestion item MUST offer status-appropriate actions: "Approve" (→ approved), "Reject" (→ rejected, with confirmation dialog), "Mark as Reviewed" (→ reviewed).
- **FR-012**: The suggestions list MUST support filtering by status via tab controls at the top of the screen.
- **FR-013**: When a session expires during active use, the app MUST display a toast notification and redirect the user to the login screen.
- **FR-014**: Signing out MUST immediately remove the Admin tab from navigation and terminate the session.
- **FR-015**: A single global authentication state hook MUST be the exclusive source of truth for session and admin status throughout the app.
- **FR-016**: The login screen MUST redirect already-authenticated users away immediately without showing the login form.

### Key Entities

- **Session**: Represents an authenticated user's identity. Contains user identifier, email address, and display name. Present when logged in, null otherwise.
- **AdminProfile**: Represents admin-specific attributes for an authenticated admin. Contains admin identifier, linked user identifier, email, display name, and promotion date. Present only when the user has admin privileges, null otherwise.
- **BrandSuggestion**: A user-submitted mapping proposal linking a brand name to a product. Contains brand name, optional barcode, optional product name, optional product image URL, optional notes, optional raw brand data, status (new | reviewed | approved | rejected), and timestamps.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A non-authenticated user sees no Admin tab — verified across cold start, session expiry, and sign-out scenarios.
- **SC-002**: After clicking a magic link, a user's authenticated status is reflected in the app within 2 seconds of the next app interaction (no additional user action required).
- **SC-003**: An admin user sees the Admin tab on every app launch and web reload without requiring a new login, for the duration of their valid session.
- **SC-004**: A logged-in non-admin user never sees the Admin tab — even if they manually navigate to the admin URL on web.
- **SC-005**: An admin can change the status of a brand suggestion in under 3 taps from the Admin screen.
- **SC-006**: The admin privilege check does not trigger more than once per 5-minute window under normal usage.
- **SC-007**: Session expiry is communicated to the user within 2 seconds of the triggering action.
- **SC-008**: Sign-out removes the Admin tab from view immediately, with no perceptible delay.

## Assumptions

- A user cannot self-register as admin; admin status is assigned server-side and cannot be changed from the mobile app.
- The magic link authentication flow is entirely handled server-side; the mobile app only requests the link and then detects session establishment on next interaction.
- Admin privilege check returning a non-403 error (e.g., network timeout) is treated as "not admin" silently — no error is shown to the user for this specific check.
- Brand suggestion status transitions are not restricted in one direction — but re-moderation UI (changing from approved/rejected back to new) is out of scope for this feature.
- The suggestions list does not require pagination in this first version — an initial load of up to 50 items per status is assumed sufficient.
- Both web and native mobile targets must be supported; UI components must behave consistently across both.
