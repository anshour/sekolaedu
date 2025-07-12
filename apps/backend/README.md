# SekolaEdu Backend

## Description

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file in the root directory and add your environment variables. You can use the `.env.example` file as a reference.
4. Run the development server:
   ```bash
   pnpm dev
   ```

### Permission schema

- 'menu.xxx' - for accessing the menu
- 'feature.xxx' - for accessing the feature
- 'action.xxx' - for accessing the action (in button)
- 'layout.xxx' - for accessing the layout (one role can have multiple layouts)

## Deploy to Google Cloud Run

```bash
gcloud builds submit --tag gcr.io/projectname/sekolaedu-backend
```

```bash
gcloud run deploy sekolaedu-backend \
  --image gcr.io/projectname/sekolaedu-backend \
  --platform managed \
  --memory 512Mi \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --concurrency 1 \
  --set-env-vars IN_SERVERLESS=true \
  --set-secrets \
JWT_EXPIRE_MINUTES=JWT_EXPIRE_MINUTES:latest,JWT_SECRET_KEY=JWT_SECRET_KEY:latest,JWT_HASH_ALGORITHM=JWT_HASH_ALGORITHM:latest,AWS_BUCKET=AWS_BUCKET:latest,AWS_DEFAULT_REGION=AWS_DEFAULT_REGION:latest,AWS_ACCESS_KEY_ID=AWS_ACCESS_KEY_ID:latest,AWS_SECRET_ACCESS_KEY=AWS_SECRET_ACCESS_KEY:latest,DB_HOST=DB_HOST:latest,DB_PORT=DB_PORT:latest,DB_USER=DB_USER:latest,DB_PASSWORD=DB_PASSWORD:latest,DB_NAME=DB_NAME:latest,DB_SSL=DB_SSL:latest,DB_SCHEMA=DB_SCHEMA:latest,EMAIL_FROM=EMAIL_FROM:latest,EMAIL_FROM_NAME=EMAIL_FROM_NAME:latest,SMTP_HOST=SMTP_HOST:latest,SMTP_PORT=SMTP_PORT:latest,SMTP_SECURE=SMTP_SECURE:latest,SMTP_USER=SMTP_USER:latest,SMTP_PASSWORD=SMTP_PASSWORD:latest
```
