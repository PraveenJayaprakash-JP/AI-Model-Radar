from scraper.providers.replicate import ReplicateClient

def test_replicate_client_fetch_models_no_key(mocker):
    """Test Replicate client returns empty list when API key is missing."""
    client = ReplicateClient()
    models = client.fetch_models()
    assert models == []

def test_replicate_client_instance():
    """Test Replicate client instantiation."""
    client = ReplicateClient()
    assert client.provider_name == "replicate"
    assert client.base_url == "https://api.replicate.com/v1/models"
