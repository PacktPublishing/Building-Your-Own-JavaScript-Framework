import { Sequelize } from "sequelize";
import config from "config";

/**
 * Represents the application's database.
 * Utilizes Sequelize for ORM functionalities.
 */
class Database {
  /**
   * Constructs the database instance.
   * Uses a configuration-defined connection string or defaults to an in-memory SQLite database.
   */
  constructor() {
    const dbConfig = config.get("databaseConnection") || "sqlite::memory:";
    this.db = new Sequelize(dbConfig);
  }

  /**
   * Authenticates the connection to the database.
   * @throws {Error} Throws an error if the authentication fails.
   */
  async authenticate() {
    await this.db.authenticate();
  }
}

export default Database;
