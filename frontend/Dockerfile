
FROM oven/bun:latest

WORKDIR /frontend


COPY package.json bun.lockb ./
RUN bun install


COPY . .


EXPOSE 5173

CMD ["bun","run", "dev", "--host", "0.0.0.0"]
