/* eslint-disable @typescript-eslint/no-explicit-any -- rtc-agent is a dynamic host integration surface; handlers/schemas are user-provided */
/**
 * rtc-agent Web Component — TypeScript Declarations for Host Integration
 *
 * Two usage modes:
 *
 * 1. UMD (this project): <script type="module" src="/rtc-agent/index.js">
 *    The component registers itself on `window.RtcAgentModule`.
 *    Types below let you cast safely: `(el as RtcAgent).agentConfig = ...`
 *
 * 2. ES module (npm install @rtc-agent/component):
 *    import { whenReady, AgentConfig } from '@rtc-agent/component';
 *    The component re-exports these plus HTMLElementTagNameMap / HTMLElementEventMap
 *    extensions so querySelector and addEventListener are type-safe automatically.
 */

// ===== Public API Types =====

/** Declarative agent configuration — the primary host integration surface */
declare interface RtcAgentFunctionDef {
  name: string;
  description: string;
  handler: (params: any) => any;
  parameters?: {
    name: string;
    required?: boolean;
    schema: Record<string, any>;
  }[];
  returns?: { schema: Record<string, any> };
}

declare interface RtcAgentFunctionGroup {
  name: string;
  description?: string;
  functions: RtcAgentFunctionDef[];
}

declare interface RtcAgentConfig {
  name?: string;
  description?: string;
  persona?: string;
  functions?: RtcAgentFunctionDef[];
  groups?: RtcAgentFunctionGroup[];
  onError?: (error: Error, context: string) => void;
}

// ===== Element Interface =====

/** The <rtc-agent> custom element */
declare interface RtcAgent extends HTMLElement {
  /** Declarative configuration — set after rtc-agent-ready event */
  agentConfig: RtcAgentConfig;
  /** Visual theme: 'light' | 'dark' */
  theme: string;
  /** App label shown in the UI header */
  appLabel: string;
}

// ===== Ready Signal =====

/**
 * UMD global: `window.RtcAgentModule.whenReady`
 * ES module: `import { whenReady } from '@rtc-agent/component'`
 */
declare interface RtcAgentModule {
  whenReady: Promise<void>;
}

// ===== Global Type Extensions =====

declare global {
  interface Window {
    RtcAgentModule?: RtcAgentModule;
  }

  interface HTMLElementTagNameMap {
    'rtc-agent': RtcAgent;
  }

  interface HTMLElementEventMap {
    'rtc-agent-ready': CustomEvent<void>;
  }
}

// Legacy API (deprecated, kept for backward compatibility)
declare module '@rtc-agent/component' {
  export function defineRegistry(config: {
    description: string;
    name: string;
    persona: string;
  }): FunctionRegistry;

  export interface FunctionRegistry {
    createGroup(config: { description: string; name: string }): FunctionGroup;
  }

  export interface FunctionGroup {
    register(config: {
      description: string;
      handler: (params: any) => any;
      name: string;
      parameters: any[];
      returns: { schema: any };
    }): void;
  }

  export const eventBus: {
    on(event: string, callback: (data: any) => void): void;
  };

  export const whenReady: Promise<void>;
  export type AgentConfig = RtcAgentConfig;
  export type AgentFunctionGroup = RtcAgentFunctionGroup;
}

declare module '@rtc-agent/persistence' {
  export const virtualFS: {
    read(path: string): Promise<string>;
    write(path: string, content: string): Promise<void>;
  };
}
