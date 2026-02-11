# Dich-Viet (Vietnamese Translation Platform)

<div align="center">

![Version](https://img.shields.io/badge/version-3.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.10+-yellow.svg)
![Next.js](https://img.shields.io/badge/Next.js-16+-black.svg)

**AI-Powered Document Translation & Content Generation Platform**

[Features](#features) | [Installation](#installation) | [Documentation](#documentation) | [Contributing](#contributing)

</div>

---

## Features

### Document Translation
- **Multi-format support**: PDF, DOCX, TXT, Markdown
- **Layout preservation**: Keeps original formatting
- **Multiple AI engines**: Claude, GPT-4, DeepL, Google, Local LLMs
- **Translation Memory (TM)**: Reuse previous translations
- **Glossary management**: Consistent terminology

### Book Writer v2.0
- **9-agent pipeline**: Analyst, Architect, Outliner, Writer, Expander, Enricher, Editor, QualityGate, Publisher
- **Word count enforcement**: 95-105% delivery guarantee
- **Multiple output formats**: DOCX, PDF, Markdown, HTML

### CAT Editor
- **Segment-by-segment editing**
- **TM suggestions with similarity scores**
- **Keyboard shortcuts for productivity**

### Batch Processing
- **Multi-file upload**
- **Progress tracking**
- **ZIP download**

---

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 20+
- pnpm 8+

### Installation

```bash
# Clone repository
git clone https://github.com/nclamvn/Dich-Viet.git
cd Dich-Viet

# Backend setup
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd frontend
pnpm install
cd ..

# Configure environment
cp .env.example .env
# Edit .env with your API keys
```

### Running

```bash
# Terminal 1: Backend
uvicorn api.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
pnpm dev
```

Open http://localhost:3000

---

## Documentation

- [API Documentation](docs/API.md)
- [Configuration Guide](docs/CONFIGURATION.md)
- [Contributing Guide](CONTRIBUTING.md)

---

## Architecture

```
+----------------------------------------------------------------+
|                     Frontend (Next.js 16)                       |
|             React Query - WebSocket - Tailwind                  |
+---------------------------------+------------------------------+
                                  |
+---------------------------------+------------------------------+
|                     FastAPI Backend                             |
|                   230+ API Endpoints                            |
+---------------------------------+------------------------------+
                                  |
        +-------------------------+-------------------------+
        |                         |                         |
   Translation              Book Writer              Glossary/TM
   Pipeline                 v2 Pipeline               Services
        |                         |                         |
   AI Providers              9 Agents                SQLite DBs
   (4 providers)             (parallel)
```

---

## Configuration

### Required API Keys (at least one)

| Provider | Environment Variable | Get Key |
|----------|---------------------|---------|
| Anthropic | `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| OpenAI | `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com) |
| DeepL | `DEEPL_API_KEY` | [deepl.com/pro](https://www.deepl.com/pro) |

### Optional Configuration

See [.env.example](.env.example) for all options.

---

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=core --cov=api

# Run specific category
pytest -m unit
pytest -m integration
```

---

## Stats

- **Backend**: 600+ Python files, 180K+ LOC
- **Frontend**: 85+ TypeScript files, 15K+ LOC
- **Tests**: 1,350+ test cases
- **API Endpoints**: 230+

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Install dev dependencies
pip install -r requirements-dev.txt

# Run linter
ruff check .

# Run formatter
ruff format .
```

---

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

---

## Acknowledgments

- [Anthropic Claude](https://anthropic.com) - AI assistance
- [OpenAI](https://openai.com) - GPT models
- [FastAPI](https://fastapi.tiangolo.com) - Backend framework
- [Next.js](https://nextjs.org) - Frontend framework

---

<div align="center">

**Made with love for the Vietnamese community**

[Back to top](#dich-viet-vietnamese-translation-platform)

</div>
