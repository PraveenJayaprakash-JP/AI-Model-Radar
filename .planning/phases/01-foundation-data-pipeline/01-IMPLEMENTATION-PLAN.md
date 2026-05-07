# Foundation & Data Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a GitHub Actions workflow that scrapes AI model pricing data every 15 minutes from 6 providers, validates it, and publishes structured JSON (`models.json`, `tasks.json`) to the repository.

**Architecture:** 
- Provider-agnostic `ProviderClient` interface with provider-specific implementations (API-based and scraping-based).
- Modular GitHub Actions workflow using a matrix strategy for parallel provider scraping.
- Schema validation (Zod/Pydantic) to ensure data quality before publication.
- Graceful degradation: Skip failed providers but publish partial JSON with success status.

**Tech Stack:**
- Language: Python (for scraping/API logic) + GitHub Actions YAML
- Libraries: Playwright/Cheerio (scraping), `httpx` (API requests), Pydantic (validation)
- Hosting: Static JSON files committed to the repository
- CI/CD: GitHub Actions (cron-based)

---

## Task Structure

### Files to Create/Modify
- `.github/workflows/scrape-data.yml` (GitHub Actions workflow)
- `scraper/providers/base.py` (Base `ProviderClient` interface)
- `scraper/providers/openai.py` (OpenAI API client)
- `scraper/providers/anthropic.py` (Anthropic API client)
- `scraper/providers/mistral.py` (Mistral scraping client)
- `scraper/providers/google.py` (Google scraping client)
- `scraper/providers/replicate.py` (Replicate API client)
- `scraper/providers/together.py` (Together AI API client)
- `scraper/schemas/models.py` (Pydantic schema for `models.json`)
- `scraper/schemas/tasks.py` (Pydantic schema for `tasks.json`)
- `scraper/main.py` (Orchestration logic)
- `scraper/errors.py` (Custom error classes)
- `scraper/utils.py` (Shared utilities, e.g., rate limiting)
- `data/models.json` (Published model data)
- `data/tasks.json` (Published task recommendations)
- `requirements.txt` (Python dependencies)

---

### Task 1: Setup Project Structure

**Files:**
- Create directories: `scraper/`, `scraper/providers/`, `scraper/schemas/`, `data/`

- [ ] **Step 1: Create directories**

```bash
git mkdir -p scraper/providers scraper/schemas data
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "chore: setup project structure for data pipeline"
```

---

### Task 2: Base Provider Interface

**Files:**
- Create: `scraper/providers/base.py`

- [ ] **Step 1: Write the failing test**

```python
# tests/test_providers_base.py
from scraper.providers.base import ProviderClient

def test_provider_client_interface():
    try:
        client = ProviderClient("test")
    except TypeError:
        pass  # Abstract class cannot be instantiated
    else:
        assert False, "ProviderClient should be abstract"
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pytest tests/test_providers_base.py -v
Expected: FAIL with "ProviderClient should be abstract"
```

- [ ] **Step 3: Write minimal implementation**

```python
# scraper/providers/base.py
from abc import ABC, abstractmethod
from typing import List, Dict

class ProviderClient(ABC):
    """Base class for provider clients (API or scraping-based)."""
    
    def __init__(self, provider_name: str):
        self.provider_name = provider_name

    @abstractmethod
    def fetch_models(self) -> List[Dict]:
        """Fetch models from the provider."""
        pass
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pytest tests/test_providers_base.py -v
Expected: PASS
```

- [ ] **Step 5: Commit**

```bash
git add scraper/providers/base.py tests/test_providers_base.py
git commit -m "feat: add ProviderClient base interface"
```

---

### Task 3: OpenAI API Client

**Files:**
- Create: `scraper/providers/openai.py`
- Test: `tests/test_providers_openai.py`

- [ ] **Step 1: Write the failing test**

```python
# tests/test_providers_openai.py
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pytest tests/test_providers_openai.py -v
Expected: FAIL with "ModuleNotFoundError: No module named 'scraper.providers.openai'"
```

- [ ] **Step 3: Write minimal implementation**

```python
# scraper/providers/openai.py
import httpx
from typing import List, Dict
from scraper.providers.base import ProviderClient

class OpenAIClient(ProviderClient):
    """OpenAI API client."""
    
    def __init__(self):
        super().__init__("openai")
        self.base_url = "https://api.openai.com/v1/models"

    def fetch_models(self) -> List[Dict]:
        response = httpx.get(self.base_url, headers={"Authorization": f"Bearer {self._get_api_key()}"})
        response.raise_for_status()
        return [self._transform_model(model) for model in response.json()["data"]]
    
    def _transform_model(self, model: Dict) -> Dict:
        return {
            "name": model["id"],
            "provider": self.provider_name,
            "launch_date": model["created"],
            "capabilities": ["text"],
            "pricing": self._get_pricing(model["id"])
        }
    
    def _get_pricing(self, model_id: str) -> Dict:
        # Mock pricing; replace with real data
        return {
            "input_cost_per_1k": 0.03,
            "output_cost_per_1k": 0.06
        }
    
    def _get_api_key(self) -> str:
        import os
        return os.getenv("OPENAI_API_KEY")
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pytest tests/test_providers_openai.py -v
Expected: PASS
```

- [ ] **Step 5: Commit**

```bash
git add scraper/providers/openai.py tests/test_providers_openai.py
git commit -m "feat: add OpenAI API client"
```

---

### Task 4: Anthropic API Client

**Files:**
- Create: `scraper/providers/anthropic.py`
- Test: `tests/test_providers_anthropic.py`

*(Repeat the pattern from Task 3 for Anthropic.)*

---

### Task 5: Mistral Scraping Client

**Files:**
- Create: `scraper/providers/mistral.py`
- Test: `tests/test_providers_mistral.py`

- [ ] **Step 1: Write the failing test**

```python
# tests/test_providers_mistral.py
from scraper.providers.mistral import MistralClient

def test_mistral_client_fetch_models(mocker):
    mock_html = """
    <div class="model">
        <h3>mistral-tiny</h3>
        <span class="tag">text</span>
    </div>
    """
    mocker.patch("httpx.get", return_value=mocker.Mock(text=mock_html))
    mocker.patch("scraper.providers.mistral.Cheerio", return_value={
        "div.model": [{"h3": {"text": lambda: "mistral-tiny"}}]
    })
    
    client = MistralClient()
    models = client.fetch_models()
    assert len(models) == 1
    assert models[0]["name"] == "mistral-tiny"
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pytest tests/test_providers_mistral.py -v
Expected: FAIL with "ModuleNotFoundError: No module named 'scraper.providers.mistral'"
```

- [ ] **Step 3: Write minimal implementation**

```python
# scraper/providers/mistral.py
import httpx
from typing import List, Dict
from scraper.providers.base import ProviderClient

class MistralClient(ProviderClient):
    """Mistral scraping client (no official API)."""
    
    def __init__(self):
        super().__init__("mistral")
        self.base_url = "https://mistral.ai/models"

    def fetch_models(self) -> List[Dict]:
        response = httpx.get(self.base_url)
        response.raise_for_status()
        return self._parse_models(response.text)
    
    def _parse_models(self, html: str) -> List[Dict]:
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html, "html.parser")
        models = []
        for model_div in soup.select("div.model"):
            models.append({
                "name": model_div.select_one("h3").text.strip(),
                "provider": self.provider_name,
                "launch_date": None,  # Scraped from another page
                "capabilities": [tag.text.strip() for tag in model_div.select(".tag")],
                "pricing": self._get_pricing(model_div.select_one("h3").text.strip())
            })
        return models
    
    def _get_pricing(self, model_name: str) -> Dict:
        # Mock pricing; replace with real data
        return {
            "input_cost_per_1k": 0.05,
            "output_cost_per_1k": 0.10
        }
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pytest tests/test_providers_mistral.py -v
Expected: PASS
```

- [ ] **Step 5: Commit**

```bash
git add scraper/providers/mistral.py tests/test_providers_mistral.py
git commit -m "feat: add Mistral scraping client"
```

---

### Task 6: Pydantic Schema for models.json

**Files:**
- Create: `scraper/schemas/models.py`
- Test: `tests/test_schemas_models.py`

- [ ] **Step 1: Write the failing test**

```python
# tests/test_schemas_models.py
from scraper.schemas.models import Model, ModelsResponse
from pydantic import ValidationError

def test_model_schema_validation():
    valid_data = {
        "name": "gpt-4",
        "provider": "openai",
        "launch_date": 1686935002,
        "capabilities": ["text"],
        "pricing": {
            "input_cost_per_1k": 0.03,
            "output_cost_per_1k": 0.06
        },
        "free_tier": True,
        "free_tier_limits": {
            "requests_per_day": 100
        }
    }
    model = Model(**valid_data)
    assert model.name == "gpt-4"
    
    # Test invalid data
    try:
        Model(name="gpt-4")
    except ValidationError:
        pass  # Expected
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pytest tests/test_schemas_models.py -v
Expected: FAIL with "ModuleNotFoundError: No module named 'scraper.schemas.models'"
```

- [ ] **Step 3: Write minimal implementation**

```python
# scraper/schemas/models.py
from pydantic import BaseModel
from typing import List, Dict, Optional

class Pricing(BaseModel):
    input_cost_per_1k: float
    output_cost_per_1k: float

class FreeTierLimits(BaseModel):
    requests_per_day: Optional[int]
    tokens_per_month: Optional[int]

class Model(BaseModel):
    name: str
    provider: str
    launch_date: Optional[int]
    capabilities: List[str]
    pricing: Pricing
    free_tier: bool = False
    free_tier_limits: Optional[FreeTierLimits] = None

class ModelsResponse(BaseModel):
    success: bool
    data: List[Model]
    timestamp: int
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pytest tests/test_schemas_models.py -v
Expected: PASS
```

- [ ] **Step 5: Commit**

```bash
git add scraper/schemas/models.py tests/test_schemas_models.py
git commit -m "feat: add Pydantic schema for models.json"
```

---

### Task 7: Orchestration Logic

**Files:**
- Create: `scraper/main.py`
- Test: `tests/test_main.py`

- [ ] **Step 1: Write the failing test**

```python
# tests/test_main.py
from scraper.main import scrape_and_publish

def test_scrape_and_publish(mocker):
    mock_clients = [
        mocker.Mock(fetch_models=lambda: [{"name": "gpt-4", "provider": "openai"}]),
        mocker.Mock(fetch_models=lambda: [])
    ]
    mocker.patch("scraper.main.get_provider_clients", return_value=mock_clients)
    
    result = scrape_and_publish()
    assert result["success"] is True
    assert len(result["data"]) == 1
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pytest tests/test_main.py -v
Expected: FAIL with "ModuleNotFoundError: No module named 'scraper.main'"
```

- [ ] **Step 3: Write minimal implementation**

```python
# scraper/main.py
from typing import List, Dict
from scraper.providers.base import ProviderClient
from scraper.providers.openai import OpenAIClient
from scraper.providers.anthropic import AnthropicClient
from scraper.providers.mistral import MistralClient
from scraper.providers.google import GoogleClient
from scraper.providers.replicate import ReplicateClient
from scraper.providers.together import TogetherClient
from scraper.schemas.models import Model, ModelsResponse
import time
import json

PROVIDERS = {
    "openai": OpenAIClient,
    "anthropic": AnthropicClient,
    "mistral": MistralClient,
    "google": GoogleClient,
    "replicate": ReplicateClient,
    "together": TogetherClient
}

def get_provider_clients() -> List[ProviderClient]:
    """Instantiate all provider clients."""
    return [client() for client in PROVIDERS.values()]

def scrape_and_publish() -> Dict:
    """Scrape all providers, validate data, and publish JSON."""
    models = []
    clients = get_provider_clients()
    
    for client in clients:
        try:
            models.extend(client.fetch_models())
        except Exception as e:
            print(f"Failed to fetch models from {client.provider_name}: {e}")
    
    # Validate data
    validated_models = []
    for model in models:
        try:
            validated_models.append(Model(**model).dict())
        except Exception as e:
            print(f"Failed to validate model {model.get('name')}: {e}")
    
    response = ModelsResponse(
        success=len(validated_models) > 0,
        data=validated_models,
        timestamp=int(time.time())
    ).dict()
    
    # Publish to data/models.json
    with open("data/models.json", "w") as f:
        json.dump(response, f, indent=2)
    
    return response
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pytest tests/test_main.py -v
Expected: PASS
```

- [ ] **Step 5: Commit**

```bash
git add scraper/main.py tests/test_main.py
git commit -m "feat: add orchestration logic"
```

---

### Task 8: GitHub Actions Workflow

**Files:**
- Create: `.github/workflows/scrape-data.yml`

- [ ] **Step 1: Write the workflow**

```yaml
# .github/workflows/scrape-data.yml
name: Scrape AI Model Data

on:
  schedule:
    - cron: '*/15 * * * *'
  workflow_dispatch:

env:
  PYTHON_VERSION: "3.10"

jobs:
  scrape:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        provider: ["openai", "anthropic", "mistral", "google", "replicate", "together"]
      fail-fast: false  # Graceful degradation
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ env.PYTHON_VERSION }}
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
      
      - name: Scrape provider
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          python -m scraper.main
      
      - name: Validate JSON
        run: |
          python -c "import json; json.load(open('data/models.json'))"
      
      - name: Commit and push (if changes)
        run: |
          git config --global user.name "github-actions"
          git config --global user.email "actions@github.com"
          git add data/models.json
          git diff --quiet || git commit -m "chore: update models.json (${{ matrix.provider }})"
          git push
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/scrape-data.yml
git commit -m "feat: add GitHub Actions workflow for scraping"
```

---

### Task 9: Requirements File

**Files:**
- Create: `requirements.txt`

- [ ] **Step 1: Write dependencies**

```text
httpx==0.23.3
pydantic==1.10.7
beautifulsoup4==4.12.2
playwright==1.32.1
python-dotenv==1.0.0
```

- [ ] **Step 2: Commit**

```bash
git add requirements.txt
git commit -m "chore: add Python dependencies"
```

---

### Task 10: Testing & Validation

**Files:**
- Test: `tests/test_integration.py`

- [ ] **Step 1: Write integration test**

```python
# tests/test_integration.py
from scraper.main import scrape_and_publish
from scraper.schemas.models import ModelsResponse

def test_scrape_and_publish_integration():
    response = scrape_and_publish()
    
    # Validate with Pydantic
    ModelsResponse(**response)
    
    # Check data freshness (within 15 minutes)
    assert (response["timestamp"] + 900) >= int(time.time())
```

- [ ] **Step 2: Run test**

```bash
pytest tests/test_integration.py -v
Expected: PASS
```

- [ ] **Step 3: Commit**

```bash
git add tests/test_integration.py
git commit -m "test: add integration test for data pipeline"
```

---

## Summary of Remaining Work

*(Tasks for Anthropic, Google, Replicate, Together AI clients follow the same pattern as Task 3 and Task 5. Repeat for each provider.)*

### Provider Implementation Tasks
- [ ] Anthropic API Client (`scraper/providers/anthropic.py`)
- [ ] Google Scraping Client (`scraper/providers/google.py`)
- [ ] Replicate API Client (`scraper/providers/replicate.py`)
- [ ] Together AI API Client (`scraper/providers/together.py`)

### Task Recommendations (`tasks.json`)
- Create `scraper/schemas/tasks.py` (Pydantic schema)
- Add task recommendation logic to `scraper/main.py`
- Publish `data/tasks.json` alongside `models.json`

---

**Plan complete.** Ready for execution using `superpowers:subagent-driven-development`.