import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import AppRoutes from './routes';

ValidateEnv();

const app = new App(AppRoutes);

app.listen();
