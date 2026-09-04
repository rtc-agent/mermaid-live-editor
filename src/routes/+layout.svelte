<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import { mode } from 'mode-watcher';
  import '../app.css';
  import initEditorAPI from '$/util/editorAPI';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  // rtc-agent 版本（与 jsDelivr CDN 上的 npm 版本对应）
  const RTC_AGENT_VERSION = '0.1.0';
  const RTC_AGENT_CDN_URL = `https://cdn.jsdelivr.net/npm/@rtc-agent/component@${RTC_AGENT_VERSION}/dist/index.js`;

  onMount(() => {
    // 初始化 editorAPI（rtc-agent 工具的底层依赖）
    initEditorAPI();

    const agent = document.querySelector<RtcAgent>('rtc-agent');
    if (!agent) return;

    const setup = () => {
      // mode.current 已经是解析后的 'light' | 'dark'（mode-watcher 处理了 'system'）
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

    // 事件驱动：rtc-agent 初始化完成后触发，无需轮询
    agent.addEventListener('rtc-agent-ready', setup, { once: true });
  });

  // 把宿主的主题切换同步到 <rtc-agent>
  $effect(() => {
    const rtcAgentEl = document.querySelector<RtcAgent>('rtc-agent');
    if (rtcAgentEl) {
      rtcAgentEl.theme = mode.current ?? 'light';
    }
  });
</script>

<svelte:head>
  <!-- 从 jsDelivr CDN 加载 rtc-agent（避免把 3MB bundle 提交到仓库） -->
  <script type="module" src={RTC_AGENT_CDN_URL}></script>
</svelte:head>

{@render children()}

<!-- 全局 AI 助手面板 -->
<rtc-agent app-label="Mermaid AI" scenarios-url="/rtc-agent/scenarios/"></rtc-agent>
