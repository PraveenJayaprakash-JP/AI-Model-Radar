from scraper.providers.together import TogetherClient

def test_together_client_fetch_models_no_key(mocker):
    """Test Together client returns empty list when API key is missing."""
    client = TogetherClient()
    models = client.fetch_models()
    assert models == []

def test_together_client_instance():
    """Test Together client instantiation."""
    client = TogetherClient()
    assert client.provider_name == "together"
    assert client.base_url == "https://api.together.xyz/models/list"
