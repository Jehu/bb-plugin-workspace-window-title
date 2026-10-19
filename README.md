# Workspace Window Title

Sets each BB window or browser-tab title to `<focused workspace> — bb`.
For example: `aesthetics-and-soul — bb`.

“Workspace” means the named workspace group in BB’s sidebar (a project in the
SDK), not an individual thread, checkout directory, or git branch. Personal
threads use `Personal — bb`.

## Behavior

- Follows navigation and the focused pane in split layouts.
- Uses live SDK state, including workspace renames; no navigation polling or
  sidebar DOM scraping.
- Each window has its own title and focus state.
- When no workspace is selected, leaves BB’s native title in place.
- Disable, removal, and reload disconnect the observer and restore the latest
  native title. No settings, network requests, storage, or backend services.

## Install

Requires BB 0.46.1+ and Plugin SDK 0.6.49+.

```sh
npm ci --include=dev
npm run typecheck
bb plugin build
bb plugin install . --yes
```

For development after installation:

```sh
bb plugin dev
```

Disable with `bb plugin disable workspace-window-title`; re-enable with
`bb plugin enable workspace-window-title`.

## Implementation

`app.tsx` registers an app-wide content script via
`PluginContentScriptRegistration`. Its `PluginContentScriptContext.signal`
controls cleanup. A null-rendering `experimental_appOverlay` component reads
`useBbContext`, `useSidebarSplitLayout`, and `experimental_useSidebarThreads`
to supply the focused workspace name. The content script owns `document.title`
and a head-only mutation observer, preserving native host title updates while
the workspace title is active. The app-overlay and sidebar data APIs are
experimental in the current SDK.

`server.ts` is the required backend entry; it registers no server behavior.

## Verification

Typecheck and production build passed. Live checks in the running BB web app
covered workspace navigation, switching focus between Personal and
another workspace in a split, separate browser tabs, disabling and re-enabling,
and native-title restoration. The native desktop window chrome is not directly
automated; these checks exercise the app’s document title.
