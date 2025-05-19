FROM node:24-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm approve-builds

RUN pnpm build


EXPOSE 8000

ENTRYPOINT [ "pnpm", "start" ]