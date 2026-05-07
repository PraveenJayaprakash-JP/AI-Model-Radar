import httpx
from typing import List, Dict
from scraper.providers.base import ProviderClient

class GoogleClient(ProviderClient):
    """Google Gemini API client."""

    def __init__(self):
        super().__init__("google")
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"

    def fetch_models(self) -> List[Dict]:
        """Fetch models from Google API."""
        api_key = self._get_api_key()
        if not api_key:
            return []
        
        try:
            response = httpx.get(
                self.base_url,
                params={"key": api_key}
            )
            response.raise_for_status()
            models_data = response.json().get("models", [])
            return [self._transform_model(model) for model in models_data]
        except Exception:
            return []

    def _transform_model(self, model: Dict) -> Dict:
        """Transform Google API model to standard format."""
        return {
            "name": model.get("name", "").replace("models/", ""),
            "provider": self.provider_name,
            "launch_date": None,
            "capabilities": ["text"] if "generateContent" in model.get("supportedGenerationMethods", []) else [],
            "pricing": self._get_pricing(model.get("name", ""))
        }

    def _get_pricing(self, model_name: str) -> Dict:
        """Get pricing for Google model."""
        # Mock pricing; replace with real data
        return {
            "input_cost_per_1k": 0.0005,
            "output_cost_per_1k": 0.0015
        }

    def _get_api_key(self) -> str:
        """Get Google API key from environment."""
        import os
        return os.getenv("GOOGLE_API_KEY", "")
