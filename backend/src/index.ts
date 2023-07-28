import "reflect-metadata"
import { setupDb } from "./infrastructure/repository/typeorm/mysql.data-source"
import { app } from "./infrastructure/api/express";

(async () => {
    console.log("initializing database")
    await setupDb();

    const port = 3000;
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
    })  
})();