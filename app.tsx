import { useLayoutEffect } from "react";
import {
  definePluginApp,
  experimental_useSidebarThreads,
  useBbContext,
  useSidebarSplitLayout,
} from "@get-bb/plugin-sdk/app";

export default definePluginApp((app) => {
  let workspace: string | null = null;
  let updateTitle = () => {};

  // BB calls its project groups “Workspaces” in the sidebar. Resolve focus
  // through SDK state, not the order of panes or the visible sidebar rows.
  function FocusedWorkspace() {
    const context = useBbContext();
    const layout = useSidebarSplitLayout();
    const { threads, projects } = experimental_useSidebarThreads();
    const pane = layout?.panes.find((pane) => pane.isFocused);
    const threadId = pane ? pane.threadId : context.threadId;
    const thread = threads.find((thread) => thread.id === threadId);
    const projectId = pane
      ? thread?.projectId
      : thread?.projectId ?? context.projectId;
    const name = projects.find((project) => project.id === projectId)?.name ?? null;

    useLayoutEffect(() => {
      workspace = name;
      updateTitle();
      return () => {
        workspace = null;
        updateTitle();
      };
    }, [name]);
    return null;
  }

  app.slots.experimental_appOverlay({
    id: "focused-workspace",
    component: FocusedWorkspace,
  });

  app.contentScripts.register({
    id: "workspace-window-title",
    mount({ signal }) {
      let nativeTitle = document.title;
      let writtenTitle = document.title;
      const sync = () => {
        // Remember host title updates so leaving a workspace or disabling the
        // plugin restores the latest BB title, not just the startup value.
        if (document.title !== writtenTitle) nativeTitle = document.title;
        writtenTitle = workspace ? `${workspace} — bb` : nativeTitle;
        if (document.title !== writtenTitle) document.title = writtenTitle;
      };
      const observer = new MutationObserver(sync);
      observer.observe(document.head, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      updateTitle = sync;
      sync();

      const dispose = () => {
        observer.disconnect();
        updateTitle = () => {};
        if (document.title === writtenTitle) document.title = nativeTitle;
      };
      signal.addEventListener("abort", dispose, { once: true });
      return () => {
        signal.removeEventListener("abort", dispose);
        dispose();
      };
    },
  });
});
