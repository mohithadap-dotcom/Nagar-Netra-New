# Contributing to NagarNetra

Thank you for helping improve NagarNetra. Contributions to the user experience, data model, AI pipeline, documentation, accessibility, and test coverage are welcome.

## Local setup

1. Fork and clone the repository.
2. Install the web dependencies with `npm install`.
3. Copy `.env.example` to `.env.local` and add only the credentials needed for your work.
4. Run the web application with `npm run dev`.
5. If you are changing the Python service, create a virtual environment and install `requirements.txt`.

Never commit API keys, service-role keys, personal information, or production data.

## Development workflow

1. Create a focused branch from `main`.
2. Keep each pull request limited to one clear change.
3. Update documentation when behavior, configuration, routes, or data contracts change.
4. Include screenshots for user-interface changes.
5. Run the relevant quality checks before opening a pull request.

## Quality checks

For web changes:

```bash
npm run build
```

For Python changes, start the service and verify the health endpoint:

```bash
uvicorn main:app --reload --port 8000
curl http://localhost:8000/health
```

Where practical, add focused automated tests for new behavior. Clearly describe any checks that could not be run.

## Pull requests

A good pull request includes:

- A short explanation of the problem and the chosen solution.
- Testing steps and results.
- Before-and-after screenshots for visual changes.
- Migration or environment-variable notes when applicable.
- No generated build output, local environments, model weights, or credentials.

## Reporting security issues

Do not open a public issue containing a secret or exploitable vulnerability. Contact the repository owner privately, rotate exposed credentials immediately, and share only the minimum reproduction details needed to investigate.
