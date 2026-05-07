from scraper.schemas.tasks import TasksResponse, TaskRecommendation
import time

def test_task_recommendation_schema():
    """Test TaskRecommendation schema."""
    task_data = {
        "task_id": "text_generation",
        "task_name": "Text Generation",
        "recommended_models": ["gpt-4", "claude-3"],
        "reason": "Best balance of cost and performance",
        "budget_tier": "mid"
    }
    task = TaskRecommendation(**task_data)
    assert task.task_id == "text_generation"
    assert len(task.recommended_models) == 2

def test_tasks_response_schema():
    """Test TasksResponse schema."""
    response_data = {
        "success": True,
        "data": [
            {
                "task_id": "text_generation",
                "task_name": "Text Generation",
                "recommended_models": ["gpt-4"],
                "reason": "Best balance",
                "budget_tier": "mid"
            }
        ],
        "timestamp": int(time.time())
    }
    response = TasksResponse(**response_data)
    assert response.success is True
    assert len(response.data) == 1
