import OsTable from './components/OsTable.vue'
import "./index.css"

OsTable.install = (app) => {
  app.component("OsTable", OsTable)
  return app;
}

export default OsTable
