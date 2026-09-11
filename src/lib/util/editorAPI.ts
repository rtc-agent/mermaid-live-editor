import type { MarkerData } from '$/types';
import { onValidationDone, updateCode, validatedState } from './state.svelte';

export interface ValidationError {
  markers: MarkerData[];
  message: string;
}

export interface ValidateResult {
  diagramType?: string;
  error?: ValidationError;
  valid: boolean;
}

/**
 * Programmatic API exposed on `window.editorAPI` for external consumers
 * (e.g. rtc-agent tools). Provides get/set/validate operations on the
 * Mermaid editor state.
 */
export interface EditorAPI {
  /** Returns the current editor code. */
  getCode(): string;

  /** Returns the detected diagram type (e.g. 'flowchart'), or undefined. */
  getDiagramType(): string | undefined;

  /** Replaces the editor code and triggers re-validation. */
  setCode(code: string): void;

  /**
   * Validates the current code. Returns the latest validation result.
   * NOTE: validation is async after setCode — call waitForReady() first
   * if you need to ensure the result reflects the latest setCode call.
   */
  validate(): ValidateResult;

  /**
   * Returns a promise that resolves once the next validation cycle
   * completes. Useful after setCode() to ensure validate() is up-to-date.
   */
  waitForReady(): Promise<void>;
}

declare global {
  interface Window {
    editorAPI: EditorAPI;
  }
}

function initEditorAPI(): void {
  let pendingValidation = false;
  const readyResolvers: (() => void)[] = [];

  onValidationDone(() => {
    pendingValidation = false;
    for (const resolve of readyResolvers.splice(0)) {
      resolve();
    }
  });

  const api: EditorAPI = {
    getCode(): string {
      return validatedState.current.code;
    },

    getDiagramType(): string | undefined {
      return validatedState.current.diagramType;
    },

    setCode(code: string): void {
      pendingValidation = true;
      updateCode(code);
    },

    validate(): ValidateResult {
      const vs = validatedState.current;
      if (vs.error) {
        return {
          error: {
            markers: vs.errorMarkers,
            message: vs.error.message
          },
          valid: false
        };
      }
      return {
        diagramType: vs.diagramType,
        valid: true
      };
    },

    waitForReady(): Promise<void> {
      if (!pendingValidation) {
        return Promise.resolve();
      }
      return new Promise<void>((resolve) => {
        readyResolvers.push(resolve);
      });
    }
  };

  window.editorAPI = api;
}

export default initEditorAPI;
