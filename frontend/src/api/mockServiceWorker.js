import { setupWorker, rest } from 'msw';

const worker = setupWorker(
  rest.get('/api/supplies', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          number: 'RM001',
          name: 'Wheat Flour',
          unitType: 'bag',
          unitsPerPackage: 25,
          type: 'raw_material',
        },
      ])
    );
  }),
  rest.post('/api/supplies', async (req, res, ctx) => {
    const newSupply = await req.json();
    return res(ctx.json({ id: 2, ...newSupply }));
  }),
  rest.put('/api/supplies/:id', async (req, res, ctx) => {
    const updatedSupply = await req.json();
    return res(ctx.json(updatedSupply));
  }),
  rest.delete('/api/supplies/:id', (req, res, ctx) => {
    return res(ctx.status(204));
  })
);

worker.start();