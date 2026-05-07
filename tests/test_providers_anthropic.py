from scraper.providers.anthropic import AnthropicClient

def test_anthropic_client_fetch_models(mocker):
    mock_response = {
        "models": [
            {
                "name": "claude-2",
                "capabilities": ["text"],
                "pricing": {"input_cost_per_1k": 0.01}
            }
        ]
    }
    mocker.patch("httpx.get", return_value=mocker.Mock(json=lambda: mock_response))

    client = AnthropicClient()
    models = client.fetch_models()
    assert len(models) == 1
    assert models[0]["name"] == "claude-2"