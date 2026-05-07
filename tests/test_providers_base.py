from scraper.providers.base import ProviderClient

def test_provider_client_interface():
    try:
        client = ProviderClient("test")
    except TypeError:
        pass  # Abstract class cannot be instantiated
    else:
        assert False, "ProviderClient should be abstract"