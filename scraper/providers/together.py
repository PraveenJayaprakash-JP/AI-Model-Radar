import httpx
from typing import List, Dict
from scraper.providers.base import ProviderClient

class TogetherClient(ProviderClient):
    """Together AI API client."""

    def __init__(self):
        super().__init__("together")
        self.base_url = "https://api.together.xyz/models/list"

    def fetch_models(self) -> List[Dict]:
        """Fetch models from Together AI API."""
        api_key = self._get_api_key()
        if not api_key:
            return []
        
        try:
            headers = {"Authorization": f"Bearer {api_key}"}
            response = httpx.get(self.base_url, headers=headers)
            response.raise_for_status()
            models_data = response.json()
            if isinstance(models_data, list):
                return [self._transform_model(model) for model in models_data]
            return []
        except Exception:
            return []

    def _transform_model(self, model: Dict) -> Dict:
        """Transform Together model to standard format."""
        model_name = model.get("name", model.get("id", ""))
        return {
            "name": model_name,
            "provider": self.provider_name,
            "launch_date": None,
            "capabilities": model.get("types", ["text"]),
            "pricing": self._get_pricing(model_name)
        }

    def _get_pricing(self, model_name: str) -> Dict:
        """Get pricing for Together model."""
        # Mock pricing; replace with real data
        return {
            "input_cost_per_1k": 0.0008,
            "output_cost_per_1k": 0.0012
        }

    def _get_api_key(self) -> str:
        """Get Together API key from environment."""
        import os
        return os.getenv("TOGETHER_API_KEY", "")
