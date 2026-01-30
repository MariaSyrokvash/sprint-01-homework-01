import { APP_CONFIG } from './config';
import { app } from './app';

app.listen(APP_CONFIG.PORT, () => {
  console.log(`Example app listening on port ${APP_CONFIG.PORT}`);
});
