export interface Model {
  id: string;
  name: string;
  provider: string;
  free_tier: boolean;
  pricing?: {
    input_cost_per_1k: number;
    output_cost_per_1k: number;
  };
  capabilities?: string[];
  launch_date?: number;
  context_window?: number;
}

export interface ModelsResponse {
  success: boolean;
  data: Model[];
  timestamp: number;
  error?: string;
}