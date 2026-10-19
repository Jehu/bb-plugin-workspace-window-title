---
name: workspace-window-title
description: Explain or manage the Workspace Window Title plugin when asked about workspace names in BB window or browser-tab titles.
---

# Workspace Window Title

Plugin ID: `workspace-window-title`. No configuration or contributed CLI commands.

Each app window or browser tab shows `<focused workspace> — bb`. Workspace
means a sidebar workspace/project, not a thread title, filesystem path, or git
branch. Split layouts follow the focused pane. Personal threads show
`Personal — bb`. With no selected workspace, BB keeps its native title.

Use core plugin commands to enable, disable, or reload it:

```sh
bb plugin enable workspace-window-title
bb plugin disable workspace-window-title
bb plugin reload workspace-window-title
```

Disabling restores BB’s latest native title and removes the observer. The
plugin uses full-trust app-wide scripts and experimental SDK app-overlay and
sidebar-state hooks; it needs BB 0.46.1+ and SDK 0.6.49+.
