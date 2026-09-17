export type ModelProviderId = string;

/** Connection data only; SDK construction belongs to a harness adapter. */
export interface ModelConnection {
  provider: ModelProviderId;
  modelId: string;
  credential?: string;
  endpoint?: string;
  /** Provider-specific options are interpreted and validated by its adapter. */
  options?: Readonly<Record<string, unknown>>;
}
