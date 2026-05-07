from scraper.providers.google import GoogleClient

def test_google_client_fetch_models_no_key(mocker):
    """Test Google client returns empty list when API key is missing."""
    client = GoogleClient()
    models = client.fetch_models()
    assert models == []

def test_google_client_instance():
    """Test Google client instantiation."""
    client = GoogleClient()
    assert client.provider_name == "google"
    assert client.base_url == "https://generativelanguage.googleapis.com/v1beta/models"
