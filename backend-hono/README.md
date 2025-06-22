To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:8080


Upload and build to google container registry:
```bash
gcloud builds submit --tag gcr.io/projectname/sekolaedu-backend-hono
```

Deploy to Google Cloud Run:
```bash
gcloud run deploy sekolaedu-backend-hono \
  --image gcr.io/projectname/sekolaedu-backend-hono \
  --platform managed \
  --memory 512Mi \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --concurrency 1 \
  --set-env-vars IN_SERVERLESS=true \
  --set-secrets \
JWT_EXPIRE_MINUTES=JWT_EXPIRE_MINUTES:latest,JWT_SECRET_KEY=JWT_SECRET_KEY:latest,JWT_HASH_ALGORITHM=JWT_HASH_ALGORITHM:latest,AWS_BUCKET=AWS_BUCKET:latest,AWS_DEFAULT_REGION=AWS_DEFAULT_REGION:latest,AWS_ACCESS_KEY_ID=AWS_ACCESS_KEY_ID:latest,AWS_SECRET_ACCESS_KEY=AWS_SECRET_ACCESS_KEY:latest,DB_HOST=DB_HOST:latest,DB_PORT=DB_PORT:latest,DB_USER=DB_USER:latest,DB_PASSWORD=DB_PASSWORD:latest,DB_NAME=DB_NAME:latest,DB_SSL=DB_SSL:latest,DB_SCHEMA=DB_SCHEMA:latest,EMAIL_FROM=EMAIL_FROM:latest,EMAIL_FROM_NAME=EMAIL_FROM_NAME:latest,SMTP_HOST=SMTP_HOST:latest,SMTP_PORT=SMTP_PORT:latest,SMTP_SECURE=SMTP_SECURE:latest,SMTP_USER=SMTP_USER:latest,SMTP_PASSWORD=SMTP_PASSWORD:latest
```
