export interface Provider {
  name: string;
  logo?: string;
}

export interface Model {
  name: string;
  provider: string; // Changed from Provider object to string to match scraped data
  launch_date?: number;
  capabilities: string[];
  pricing?: {
    input_cost_per_1k?: number;
    output_cost_per_1k?: number;
  };
  free_tier?: {
    requests_per_day?: number;
    tokens_per_month?: number;
  };
  context_window?: number;
}

export type ModelsResponse = {
  success: boolean;
  data: Model[];
  timestamp: number;
};
