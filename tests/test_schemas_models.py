from scraper.schemas.models import Model, ModelsResponse, Pricing, FreeTierLimits
from pydantic import ValidationError
import pytest

def test_model_schema_validation():
    """Test model schema validation."""
    valid_data = {
        "name": "gpt-4",
        "provider": "openai",
        "launch_date": 1686935002,
        "capabilities": ["text"],
        "pricing": {
            "input_cost_per_1k": 0.03,
            "output_cost_per_1k": 0.06
        },
        "free_tier": True,
        "free_tier_limits": {
            "requests_per_day": 100
        }
    }
    model = Model(**valid_data)
    assert model.name == "gpt-4"
    assert model.provider == "openai"
    assert model.free_tier is True

def test_model_schema_invalid_missing_required():
    """Test model schema rejects invalid data."""
    try:
        Model(name="gpt-4")
    except ValidationError:
        pass  # Expected
    else:
        assert False, "Should have raised ValidationError"

def test_models_response_schema():
    """Test ModelsResponse schema."""
    import time
    response_data = {
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
                }
            }
        ],
        "timestamp": int(time.time())
    }
    response = ModelsResponse(**response_data)
    assert response.success is True
    assert len(response.data) == 1
    assert response.data[0].name == "gpt-4"

def test_pricing_schema():
    """Test Pricing schema."""
    pricing = Pricing(input_cost_per_1k=0.03, output_cost_per_1k=0.06)
    assert pricing.input_cost_per_1k == 0.03
    assert pricing.output_cost_per_1k == 0.06

def test_free_tier_limits_schema():
    """Test FreeTierLimits schema."""
    limits = FreeTierLimits(requests_per_day=100, tokens_per_month=1000)
    assert limits.requests_per_day == 100
    assert limits.tokens_per_month == 1000
