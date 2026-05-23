import {connectMongo, config} from "./src/utils/index.js";
import app from "./app.js";

connectMongo()
  .then(() => {
    app.on("error", (err) => {
      console.log(`mongo error: ${err}`);
    });
    const server = app.listen(config.port || 5000, () => {
      console.log(`Listening on port ${config.port}`);
    });

    process.on('SIGINT', () => {
      console.log('Closing server...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  })
  .catch((err) => console.log(`mongo error: ${err}`));