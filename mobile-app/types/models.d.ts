export interface Provider {
  name: string;
  logo?: string;
}

export interface Model {
  name: string;
  provider: Provider;
  launch_date?: number;
  capabilities: string[];
  pricing: {
    input_cost_per_1k: number;
    output_cost_per_1k: number;
  };
  free_tier?: {
    requests_per_day?: number;
    tokens_per_month?: number;
  };
}

export type ModelsResponse = {
  success: boolean;
  data: Model[];
  timestamp: number;
};