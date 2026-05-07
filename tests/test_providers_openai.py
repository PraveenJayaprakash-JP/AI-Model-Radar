from scraper.providers.openai import OpenAIClient

def test_openai_client_fetch_models(mocker):
    mock_response = {
        "data": [
            {
                "id": "gpt-4",
                "object": "model",
                "created": 1686935002,
                "owned_by": "openai"
            }
        ]
    }
    mocker.patch("httpx.get", return_value=mocker.Mock(json=lambda: mock_response))
    
    client = OpenAIClient()
    models = client.fetch_models()
    assert len(models) == 1
    assert models[0]["name"] == "gpt-4"