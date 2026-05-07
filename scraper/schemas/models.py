"""Pydantic schemas for models.json"""
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Optional

class Pricing(BaseModel):
    """Pricing information for a model."""
    input_cost_per_1k: float = Field(..., description="Input cost per 1K tokens")
    output_cost_per_1k: float = Field(..., description="Output cost per 1K tokens")

class FreeTierLimits(BaseModel):
    """Free tier limitations."""
    requests_per_day: Optional[int] = Field(None, description="Max requests per day")
    tokens_per_month: Optional[int] = Field(None, description="Max tokens per month")
    requests_per_minute: Optional[int] = Field(None, description="Max requests per minute")

class Model(BaseModel):
    """A single AI model."""
    name: str = Field(..., description="Model name/ID")
    provider: str = Field(..., description="Provider name")
    launch_date: Optional[int] = Field(None, description="Unix timestamp of launch")
    capabilities: List[str] = Field(default_factory=list, description="Model capabilities")
    pricing: Pricing = Field(..., description="Pricing information")
    free_tier: bool = Field(False, description="Whether model offers free tier")
    free_tier_limits: Optional[FreeTierLimits] = Field(None, description="Free tier limitations")
    context_window: Optional[int] = Field(None, description="Context window size")
    description: Optional[str] = Field(None, description="Model description")

class ModelsResponse(BaseModel):
    """Response containing all models."""
    success: bool = Field(..., description="Whether fetch was successful")
    data: List[Model] = Field(default_factory=list, description="List of models")
    timestamp: int = Field(..., description="Fetch timestamp (Unix)")
    error: Optional[str] = Field(None, description="Error message if any")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "data": [
                    {
                        "name": "gpt-4",
                        "provider": "openai",
                        "launch_date": 1686935002,
                        "capabilities": ["text"],
                        "pricing": {
                            "input_cost_per_1k": 0.03,
                            "output_cost_per_1k": 0.06
                        },
                        "free_tier": False,
                        "context_window": 8192
                    }
                ],
                "timestamp": 1683907200
            }
        }
    )
