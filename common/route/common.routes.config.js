/**
 * Abstract Class Animal.
 *
 * @class CommonRoutesConfig
 */

export class CommonRoutesConfig {
  constructor(app, name) {
    if (this.constructor == CommonRoutesConfig) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.app = app
    this.name = name
    this.configureRoutes()
  }

  getName() {
    return this.name
  }

  configureRoutes() {
    throw new Error("Method 'configureRoutes()' must be implemented.");
  }
}