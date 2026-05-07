import httpx
from typing import List, Dict
from scraper.providers.base import ProviderClient

class ReplicateClient(ProviderClient):
    """Replicate API client."""

    def __init__(self):
        super().__init__("replicate")
        self.base_url = "https://api.replicate.com/v1/models"

    def fetch_models(self) -> List[Dict]:
        """Fetch models from Replicate API."""
        api_key = self._get_api_key()
        if not api_key:
            return []
        
        try:
            headers = {"Authorization": f"Token {api_key}"}
            response = httpx.get(self.base_url, headers=headers)
            response.raise_for_status()
            models_data = response.json().get("results", [])
            return [self._transform_model(model) for model in models_data]
        except Exception:
            return []

    def _transform_model(self, model: Dict) -> Dict:
        """Transform Replicate model to standard format."""
        return {
            "name": f"{model.get('owner', '')}/{model.get('name', '')}",
            "provider": self.provider_name,
            "launch_date": None,
            "capabilities": ["text", "image"],  # Replicate hosts diverse models
            "pricing": self._get_pricing(model.get("name", ""))
        }

    def _get_pricing(self, model_name: str) -> Dict:
        """Get pricing for Replicate model."""
        # Mock pricing; replace with real data from API
        return {
            "input_cost_per_1k": 0.001,
            "output_cost_per_1k": 0.002
        }

    def _get_api_key(self) -> str:
        """Get Replicate API key from environment."""
        import os
        return os.getenv("REPLICATE_API_KEY", "")
