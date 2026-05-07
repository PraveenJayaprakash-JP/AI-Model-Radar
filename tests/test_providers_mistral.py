from scraper.providers.mistral import MistralClient

def test_mistral_client_fetch_models(mocker):
    mock_html = """
    <div class="model">
        <h3>mistral-tiny</h3>
        <span class="tag">text</span>
    </div>
    """
    mocker.patch("httpx.get", return_value=mocker.Mock(text=mock_html))

    client = MistralClient()
    models = client.fetch_models()
    assert len(models) == 1
    assert models[0]["name"] == "mistral-tiny"