from scraper.main import scrape_and_publish, generate_task_recommendations, get_provider_clients
from scraper.schemas.models import ModelsResponse
from scraper.schemas.tasks import TasksResponse
import json
import os

def test_get_provider_clients():
    """Test provider client instantiation."""
    clients = get_provider_clients()
    assert len(clients) > 0
    provider_names = [c.provider_name for c in clients]
    assert "openai" in provider_names
    assert "anthropic" in provider_names
    assert "mistral" in provider_names

def test_scrape_and_publish_returns_valid_structure(mocker):
    """Test scrape_and_publish returns valid ModelsResponse structure."""
    # Mock the provider clients
    mock_client = mocker.Mock()
    mock_client.provider_name = "test"
    mock_client.fetch_models.return_value = [
        {
            "name": "test-model",
            "provider": "test",
            "launch_date": None,
            "capabilities": ["text"],
            "pricing": {
                "input_cost_per_1k": 0.01,
                "output_cost_per_1k": 0.02
            }
        }
    ]
    
    mocker.patch("scraper.main.get_provider_clients", return_value=[mock_client])
    
    result = scrape_and_publish()
    
    # Validate result structure
    assert result["success"] is True
    assert "data" in result
    assert "timestamp" in result
    assert len(result["data"]) > 0

def test_generate_task_recommendations():
    """Test task recommendations generation."""
    result = generate_task_recommendations()
    
    # Validate result structure
    assert result["success"] is True
    assert "data" in result
    assert "timestamp" in result
    assert len(result["data"]) > 0
    
    # Check data file was written
    assert os.path.exists("data/tasks.json")

def test_scrape_and_publish_creates_json_file(mocker):
    """Test that scrape_and_publish creates data/models.json."""
    mock_client = mocker.Mock()
    mock_client.provider_name = "test"
    mock_client.fetch_models.return_value = []
    
    mocker.patch("scraper.main.get_provider_clients", return_value=[mock_client])
    
    scrape_and_publish()
    
    assert os.path.exists("data/models.json")
