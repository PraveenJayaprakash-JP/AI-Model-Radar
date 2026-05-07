from scraper.utils import RateLimiter, retry_with_backoff
import time

def test_rate_limiter_initialization():
    """Test RateLimiter initialization."""
    limiter = RateLimiter(requests_per_minute=60)
    assert limiter.requests_per_minute == 60
    assert limiter.min_interval == 1.0

def test_rate_limiter_wait():
    """Test RateLimiter wait functionality."""
    limiter = RateLimiter(requests_per_minute=10)
    
    start = time.time()
    limiter.wait_if_needed()
    limiter.wait_if_needed()
    elapsed = time.time() - start
    
    # Should have waited at least min_interval seconds
    assert elapsed >= limiter.min_interval - 0.1  # Allow 0.1s tolerance

def test_retry_with_backoff_success():
    """Test retry_with_backoff with successful function."""
    call_count = 0
    
    def test_func():
        nonlocal call_count
        call_count += 1
        return "success"
    
    result = retry_with_backoff(test_func, max_retries=3)
    assert result == "success"
    assert call_count == 1

def test_retry_with_backoff_eventually_succeeds():
    """Test retry_with_backoff retrying then succeeding."""
    call_count = 0
    
    def test_func():
        nonlocal call_count
        call_count += 1
        if call_count < 2:
            raise ValueError("Not yet")
        return "success"
    
    result = retry_with_backoff(test_func, max_retries=3, initial_delay=0.01)
    assert result == "success"
    assert call_count == 2

def test_retry_with_backoff_max_retries_exceeded():
    """Test retry_with_backoff raises after max retries."""
    def failing_func():
        raise ValueError("Always fails")
    
    try:
        retry_with_backoff(failing_func, max_retries=2, initial_delay=0.01)
        assert False, "Should have raised ValueError"
    except ValueError:
        pass
