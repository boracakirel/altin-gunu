import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/api/health', async () => ({
  status: 'ok',
  service: 'altin-gunu-server',
}));

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    void app.close().catch((error: unknown) => {
      app.log.error(error);
      process.exitCode = 1;
    });
  });
}

try {
  await app.listen({ port: 3001, host: '127.0.0.1' });
} catch (error) {
  app.log.error(error);
  process.exitCode = 1;
}
