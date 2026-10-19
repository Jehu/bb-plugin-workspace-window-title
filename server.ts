import type { BbPluginApi } from "@get-bb/plugin-sdk";

// The manifest requires a backend entry; all behavior is window-local.
export default function workspaceWindowTitle(_bb: BbPluginApi) {}
