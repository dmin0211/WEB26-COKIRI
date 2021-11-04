import * as express from 'express';
import * as loaders from 'src/loaders';
import * as dotenv from 'dotenv';
dotenv.config();

const app: express.Application = express();

loaders.init(app);

export default app;