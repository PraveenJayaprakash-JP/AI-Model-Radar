"""Pydantic schemas for tasks.json"""
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

class TaskRecommendation(BaseModel):
    """A recommended model for a specific task."""
    task_id: str = Field(..., description="Task identifier")
    task_name: str = Field(..., description="Human-readable task name")
    recommended_models: List[str] = Field(..., description="List of recommended model names")
    reason: str = Field(..., description="Why these models are recommended")
    budget_tier: str = Field("free", description="Budget tier: free, low-cost, mid, premium")

class TasksResponse(BaseModel):
    """Response containing task recommendations."""
    success: bool = Field(..., description="Whether fetch was successful")
    data: List[TaskRecommendation] = Field(default_factory=list, description="Task recommendations")
    timestamp: int = Field(..., description="Generation timestamp (Unix)")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "data": [
                    {
                        "task_id": "text_generation",
                        "task_name": "Text Generation",
                        "recommended_models": ["gpt-3.5-turbo", "claude-2"],
                        "reason": "Best balance of cost and performance",
                        "budget_tier": "low-cost"
                    }
                ],
                "timestamp": 1683907200
            }
        }
    )
