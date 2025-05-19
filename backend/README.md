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

## Deploy to Google Cloud Run

```bash
gcloud builds submit --tag gcr.io/yourprojectname/sekolaedu-backend
```

```bash
gcloud run deploy sekolaedu-backend \
  --image gcr.io/yourprojectname/sekolaedu-backend \
  --platform managed \
  --memory 512Mi \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --concurrency 1 \
  --set-secrets AWS_BUCKET=AWS_BUCKET:latest,AWS_DEFAULT_REGION=AWS_DEFAULT_REGION:latest,AWS_ACCESS_KEY_ID=AWS_ACCESS_KEY_ID:latest,AWS_SECRET_ACCESS_KEY=AWS_SECRET_ACCESS_KEY:latest
```
