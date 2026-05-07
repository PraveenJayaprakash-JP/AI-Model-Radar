"""Custom error classes for the scraper."""

class ScraperError(Exception):
    """Base error for scraper operations."""
    pass

class ProviderError(ScraperError):
    """Error from a provider client."""
    pass

class ValidationError(ScraperError):
    """Error validating model data."""
    pass

class NetworkError(ProviderError):
    """Network-related error."""
    pass

class RateLimitError(ProviderError):
    """Rate limit exceeded."""
    pass
