import { AuthRoute } from './auth.route';
import { UserRoute } from './users.route';

const AppRoutes = [new AuthRoute(), new UserRoute()];

export default AppRoutes;
