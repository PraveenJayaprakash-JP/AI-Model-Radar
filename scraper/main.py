"""Main orchestration logic for scraping and publishing model data."""
import json
import time
import os
from typing import List, Dict, Any
from scraper.providers.base import ProviderClient
from scraper.providers.openai import OpenAIClient
from scraper.providers.anthropic import AnthropicClient
from scraper.providers.mistral import MistralClient
from scraper.providers.google import GoogleClient
from scraper.providers.replicate import ReplicateClient
from scraper.providers.together import TogetherClient
from scraper.schemas.models import Model, ModelsResponse
from scraper.schemas.tasks import TasksResponse, TaskRecommendation

PROVIDERS = {
    "openai": OpenAIClient,
    "anthropic": AnthropicClient,
    "mistral": MistralClient,
    "google": GoogleClient,
    "replicate": ReplicateClient,
    "together": TogetherClient
}

TASK_RECOMMENDATIONS = [
    {
        "task_id": "text_generation",
        "task_name": "Text Generation",
        "recommended_models": ["gpt-3.5-turbo", "claude-3-opus"],
        "reason": "Best balance of cost and performance for general text generation",
        "budget_tier": "mid"
    },
    {
        "task_id": "code_generation",
        "task_name": "Code Generation",
        "recommended_models": ["gpt-4", "claude-3-sonnet"],
        "reason": "Superior code understanding and generation capabilities",
        "budget_tier": "premium"
    },
    {
        "task_id": "embeddings",
        "task_name": "Text Embeddings",
        "recommended_models": ["text-embedding-3-small"],
        "reason": "Specialized embeddings with low cost",
        "budget_tier": "free"
    },
    {
        "task_id": "summarization",
        "task_name": "Text Summarization",
        "recommended_models": ["gpt-3.5-turbo", "mistral-medium"],
        "reason": "Effective summarization at lower cost",
        "budget_tier": "low-cost"
    },
    {
        "task_id": "image_generation",
        "task_name": "Image Generation",
        "recommended_models": ["dall-e-3"],
        "reason": "State-of-the-art image generation",
        "budget_tier": "premium"
    }
]

def get_provider_clients() -> List[ProviderClient]:
    """Instantiate all provider clients."""
    clients = []
    for provider_class in PROVIDERS.values():
        try:
            clients.append(provider_class())
        except Exception as e:
            print(f"Failed to instantiate provider: {e}")
    return clients

def scrape_and_publish() -> Dict[str, Any]:
    """Scrape all providers, validate data, and publish JSON."""
    models: List[Dict] = []
    clients = get_provider_clients()
    
    # Fetch models from all providers
    for client in clients:
        try:
            provider_models = client.fetch_models()
            models.extend(provider_models)
            print(f"Successfully fetched {len(provider_models)} models from {client.provider_name}")
        except Exception as e:
            print(f"Failed to fetch models from {client.provider_name}: {e}")
    
    # Validate data using Pydantic
    validated_models = []
    for model in models:
        try:
            validated_model = Model(**model)
            validated_models.append(validated_model.model_dump())
        except Exception as e:
            print(f"Failed to validate model {model.get('name')}: {e}")
    
    # Create response
    response = ModelsResponse(
        success=len(validated_models) > 0,
        data=validated_models,
        timestamp=int(time.time())
    )
    
    # Ensure data directory exists
    os.makedirs("data", exist_ok=True)
    
    # Publish to data/models.json
    with open("data/models.json", "w") as f:
        json.dump(response.model_dump(), f, indent=2)
    
    print(f"Published {len(validated_models)} models to data/models.json")
    
    return response.model_dump()

def generate_task_recommendations() -> Dict[str, Any]:
    """Generate task-based recommendations."""
    recommendations = []
    for task in TASK_RECOMMENDATIONS:
        recommendations.append(TaskRecommendation(**task))
    
    response = TasksResponse(
        success=True,
        data=[rec.model_dump() for rec in recommendations],
        timestamp=int(time.time())
    )
    
    # Ensure data directory exists
    os.makedirs("data", exist_ok=True)
    
    # Publish to data/tasks.json
    with open("data/tasks.json", "w") as f:
        json.dump(response.model_dump(), f, indent=2)
    
    print(f"Published {len(recommendations)} task recommendations to data/tasks.json")
    
    return response.model_dump()

if __name__ == "__main__":
    scrape_and_publish()
    generate_task_recommendations()
