<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onDestroy, onMount } from 'svelte';
  import { mode } from 'mode-watcher';
  import { base } from '$app/paths';
  import { z, withMeta, createRtcAgent } from '@rtc-agent/component';
  import type { RtcAgentWithLifecycle } from '@rtc-agent/component';
  import '../app.css';
  import initEditorAPI from '$/util/editorAPI';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  // rtc-agent instance with lifecycle management
  let rtcAgent: RtcAgentWithLifecycle | null = null;

  onMount(() => {
    // Initialize editorAPI (required by rtc-agent tools)
    initEditorAPI();

    // Create rtc-agent using factory function
    rtcAgent = createRtcAgent({
      agentDescription: 'Mermaid Live Editor - AI assistant for creating diagrams',
      agentName: 'MermaidEditor',
      appLabel: 'Mermaid AI',
      groups: [
        {
          description: 'Editor operations for reading and writing Mermaid code',
          functions: [
            {
              description: 'Get the current Mermaid code from the editor',
              handler: () => window.editorAPI.getCode(),
              name: 'getCode',
              returns: { schema: { description: 'The current Mermaid code', type: 'string' } }
            },
            {
              description: 'Replace the entire editor content with new Mermaid code.',
              handler: (params: { code: string }) => {
                window.editorAPI.setCode(params.code);
                return { success: true };
              },
              name: 'setCode',
              returns: {
                schema: { properties: { success: { type: 'boolean' } }, type: 'object' }
              },
              zodSchema: z.object({
                code: withMeta(z.string(), { example: 'graph TD\n    A-->B' }).describe(
                  'The Mermaid code to write to the editor'
                )
              })
            },
            {
              description: 'Get the detected diagram type',
              handler: () => window.editorAPI.getDiagramType() ?? 'unknown',
              name: 'getDiagramType',
              returns: {
                schema: { description: 'The diagram type or "unknown"', type: 'string' }
              }
            },
            {
              description: 'Validate the current Mermaid code and return any syntax errors.',
              handler: () => window.editorAPI.validate(),
              name: 'validate',
              returns: { schema: { description: 'Validation result', type: 'object' } }
            }
          ],
          name: 'editor'
        }
      ],
      on: {
        ready: () => {
          console.log('[Mermaid AI] RTC Agent ready');
        }
      },
      persona: `You are a helpful Mermaid diagram assistant. You help users create and edit
Mermaid diagrams through natural language conversation. You can write Mermaid code,
check for syntax errors, and fix issues. Always validate your code after writing it
to ensure correctness. When creating diagrams, explain what you're drawing and use
clear, descriptive node names.`,
      scenariosUrl: `${base}/rtc-agent/scenarios/`,
      server: {
        redirectUri: `${base}/auth/callback.html`,
        url: 'https://rtc-agent.cherish.chat'
      },
      theme: mode.current ?? 'light',
      // SharedWorker URL - copied by rtc-agent-setup CLI tool
      window: {
        bubblePosition: {
          corner: 'bottom-left',
          offset: { x: 20, y: 20 }
        }
      },
      workerUrl: `${base}/rtc-agent/shared-worker.js`
    });

    // Append to DOM
    document.body.appendChild(rtcAgent);
  });

  // Sync host theme changes to <rtc-agent>
  $effect(() => {
    if (rtcAgent) {
      rtcAgent.theme = mode.current ?? 'light';
    }
  });

  // Cleanup on unmount
  onDestroy(() => {
    if (rtcAgent) {
      rtcAgent.destroy();
      rtcAgent = null;
    }
  });
</script>

{@render children()}
