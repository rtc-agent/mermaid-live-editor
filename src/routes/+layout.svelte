<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import { mode } from 'mode-watcher';
  import { base } from '$app/paths';
  import '../app.css';
  import initEditorAPI from '$/util/editorAPI';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  // rtc-agent configuration
  // Two modes: local development (RTC_AGENT_LOCAL_URL) or CDN (RTC_AGENT_CDN_URL)
  // Switch modes using: pnpm rtc-agent:local or pnpm rtc-agent:cdn
  const RTC_AGENT_VERSION = '0.1.6';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Available for local development mode
  const RTC_AGENT_LOCAL_URL = '/rtc-agent-local/index.js';
  const RTC_AGENT_CDN_URL = `https://cdn.jsdelivr.net/npm/@rtc-agent/component@${RTC_AGENT_VERSION}/dist/index.js`;

  // Use CDN mode for production, local mode for development
  // To switch: use the npm scripts or manually change this constant
  const RTC_AGENT_URL = RTC_AGENT_CDN_URL; // Change to RTC_AGENT_LOCAL_URL for local development

  onMount(() => {
    // Initialize editorAPI (required by rtc-agent tools)
    initEditorAPI();

    const agent = document.querySelector<RtcAgent>('rtc-agent');
    if (!agent) return;

    const setup = () => {
      // mode.current is already resolved to 'light' | 'dark' (mode-watcher handles 'system')
      agent.theme = mode.current ?? 'light';

      agent.agentConfig = {
        description: 'Mermaid Live Editor - AI assistant for creating diagrams',
        name: 'MermaidEditor',
        persona: `You are a helpful Mermaid diagram assistant. You help users create and edit
Mermaid diagrams through natural language conversation. You can write Mermaid code,
check for syntax errors, and fix issues. Always validate your code after writing it
to ensure correctness. When creating diagrams, explain what you're drawing and use
clear, descriptive node names.`,
        groups: [
          {
            description: 'Editor operations for reading and writing Mermaid code',
            name: 'editor',
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
                parameters: [
                  {
                    name: 'code',
                    required: true,
                    schema: {
                      description: 'The Mermaid code to write to the editor',
                      type: 'string'
                    }
                  }
                ],
                returns: {
                  schema: { properties: { success: { type: 'boolean' } }, type: 'object' }
                }
              },
              {
                description: 'Validate the current Mermaid code and return any syntax errors.',
                handler: () => window.editorAPI.validate(),
                name: 'validate',
                returns: { schema: { description: 'Validation result', type: 'object' } }
              },
              {
                description: 'Get the detected diagram type',
                handler: () => window.editorAPI.getDiagramType() ?? 'unknown',
                name: 'getDiagramType',
                returns: {
                  schema: { description: 'The diagram type or "unknown"', type: 'string' }
                }
              }
            ]
          }
        ]
      };
    };

    // Event-driven: triggers after rtc-agent initializes, no polling needed
    agent.addEventListener('rtc-agent-ready', setup, { once: true });
  });

  // Sync host theme changes to <rtc-agent>
  $effect(() => {
    const rtcAgentEl = document.querySelector<RtcAgent>('rtc-agent');
    if (rtcAgentEl) {
      rtcAgentEl.theme = mode.current ?? 'light';
    }
  });
</script>

<svelte:head>
  <!-- Load rtc-agent web component -->
  <script type="module" src={RTC_AGENT_URL}></script>
</svelte:head>

{@render children()}

<!-- Global AI assistant panel -->
<rtc-agent
  app-label="Mermaid AI"
  scenarios-url="{base}/rtc-agent/scenarios/"
  redirect-uri="{base}/auth/callback.html"
  server-url="https://rtc-agent.cherish.chat"></rtc-agent>
