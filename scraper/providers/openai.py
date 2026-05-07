import httpx
from typing import List, Dict
from scraper.providers.base import ProviderClient

class OpenAIClient(ProviderClient):
    """OpenAI API client."""

    def __init__(self):
        super().__init__("openai")
        self.base_url = "https://api.openai.com/v1/models"

    def fetch_models(self) -> List[Dict]:
        response = httpx.get(self.base_url, headers={"Authorization": f"Bearer {self._get_api_key()}"})
        response.raise_for_status()
        return [self._transform_model(model) for model in response.json()["data"]]

    def _transform_model(self, model: Dict) -> Dict:
        return {
            "name": model["id"],
            "provider": self.provider_name,
            "launch_date": model["created"],
            "capabilities": ["text"],
            "pricing": self._get_pricing(model["id"])
        }

    def _get_pricing(self, model_id: str) -> Dict:
        # Mock pricing; replace with real data
        return {
            "input_cost_per_1k": 0.03,
            "output_cost_per_1k": 0.06
        }

    def _get_api_key(self) -> str:
        import os
        return os.getenv("OPENAI_API_KEY")