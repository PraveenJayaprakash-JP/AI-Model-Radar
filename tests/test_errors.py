from scraper.errors import (
    ScraperError, ProviderError, ValidationError,
    NetworkError, RateLimitError
)

def test_scraper_error():
    """Test ScraperError."""
    error = ScraperError("Test error")
    assert str(error) == "Test error"
    assert isinstance(error, Exception)

def test_provider_error():
    """Test ProviderError."""
    error = ProviderError("Provider failed")
    assert isinstance(error, ScraperError)

def test_validation_error():
    """Test ValidationError."""
    error = ValidationError("Invalid data")
    assert isinstance(error, ScraperError)

def test_network_error():
    """Test NetworkError."""
    error = NetworkError("Connection failed")
    assert isinstance(error, ProviderError)

def test_rate_limit_error():
    """Test RateLimitError."""
    error = RateLimitError("Rate limit exceeded")
    assert isinstance(error, ProviderError)
