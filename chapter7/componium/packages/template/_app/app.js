import Componium from "componium";

/**
 * Main application skeleton
 */

// Initialize Componium application
const app = await Componium.initialize();

// Create server instance with specified options
const server = await app.createServer({
  name: "new-app",
  routesRootDir: "routes",
  port: 9000,
});
