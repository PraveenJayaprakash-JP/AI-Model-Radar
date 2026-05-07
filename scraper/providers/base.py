from abc import ABC, abstractmethod
from typing import List, Dict

class ProviderClient(ABC):
    """Base class for provider clients (API or scraping-based)."""
    
    def __init__(self, provider_name: str):
        self.provider_name = provider_name

    @abstractmethod
    def fetch_models(self) -> List[Dict]:
        """Fetch models from the provider."""
        pass