import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import {Request, Response} from "express";
import * as cors from 'cors';
import * as helmet from 'helmet';
const PORT = 3000;
import routes from './rutas';


createConnection().then(async connection => {

    // create express app
    const app = express();
    
    //Middleware
    app.use(cors());
    app.use(helmet());
    
    app.use(express.json());

    //routes
    app.use('/',routes);

    // start express server
    app.listen(PORT, () => console.log("El servidor esta corriendo en el puerto "+PORT));

    console.log("Express server has started on port 3000. Open http://localhost:3000/user to see results");

}).catch(error => console.log(error));
