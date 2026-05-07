import httpx
from typing import List, Dict
from scraper.providers.base import ProviderClient

class AnthropicClient(ProviderClient):
    """Anthropic API client."""

    def __init__(self):
        super().__init__("anthropic")
        self.base_url = "https://api.anthropic.com/v1/models"

    def fetch_models(self) -> List[Dict]:
        response = httpx.get(self.base_url, headers={"x-api-key": self._get_api_key()})
        response.raise_for_status()
        return [self._transform_model(model) for model in response.json()["models"]]

    def _transform_model(self, model: Dict) -> Dict:
        return {
            "name": model["name"],
            "provider": self.provider_name,
            "launch_date": None,  # Anthropic API doesn't return launch date
            "capabilities": model["capabilities"],
            "pricing": self._get_pricing(model.get("pricing"))
        }

    def _get_pricing(self, pricing_data: Dict) -> Dict:
        # Handle missing pricing data
        if not pricing_data:
            return {
                "input_cost_per_1k": 0.0,
                "output_cost_per_1k": 0.0
            }
        return {
            "input_cost_per_1k": pricing_data.get("input_cost_per_1k", 0.0),
            "output_cost_per_1k": pricing_data.get("output_cost_per_1k", 0.0)
        }

    def _get_api_key(self) -> str:
        import os
        return os.getenv("ANTHROPIC_API_KEY")