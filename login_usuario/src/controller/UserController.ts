import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import {validate} from "class-validator";
import { RequestOptions } from "https";


export class UserController {
    static getAll = async (req: Request, res:Response) => {
        const userRepository = getRepository(User);
        let users;

        try {
            
            users = await userRepository.find();
            res.send(users);
        }catch (e) {
            res.status(400).json({ message: 'something goes wrog' });
        }

        if (users.length > 0) {
            res.send(users);
        } else {
            res.status(404).json({message: ' Not result'});
        }
    };

    static getById = async (req: Request, res: Response) => {
        const {id} = req.params;
        const  userRepository = getRepository(User);

        try {
            
            const user = await userRepository.findOneOrFail(id);
            res.send(user);
        }catch (e) {
            res.status(400).json({ message: 'No resulta' });
        }
    }

    static newUser = async (req: Request, res: Response) => {
        const {username, password, rol} = req.body;
        const user = new User();

        user.username = username;
        user.password = password;
        user.role = rol;

        //validate 

        //Con esta funcion le indicamos a la variable donde mostramos el error, que cosas del error no queremos enviar, por ejemplo el value ya que esta es la que trae la contraseña encriptada
        const validationOpt = { validationError: { target: false, value: false }};
        
        const errors = await validate(user,validationOpt);
        if (errors.length > 0) {
            return res.status(400).json(errors);

        }

        //TODO: HASH PASSWORD

        const userRepository = getRepository(User);
        try{
            user.hashPassword();
            await userRepository.save(user);
        }
        catch (e) {
            return res.status(409).json({message: 'Username already exist'});
        }

        // All ok
        res.send("User created");
    }

    static editUser = async (req: Request, res: Response) => {
        let user;
        const {id} = req.params; // params nos devuelve el valor que recibe en la url, en este caso el id
        const {username, role} = req.body; //body nos devuelve lo que recibe por post, en este caso el json
        const userRepository = getRepository(User);

        //try get user

        try {
            //Primero busca en la bd a ver si el usuario exite
            user = await userRepository.findOneOrFail(id);

            /*Luego los guarda en estas varibles que iran a la bd, pero ojo que aun no se esta guardando en la bd
            Solo se dejo alli como quien dice por si acaso se guardara, si en el proceso se deniega el proceso esto no afectara
            a la bd
            */
            user.username = username;
            user.role = role;
            
        }catch (e) {
            return res.status(404).json({message: 'User not found'});
        }

        //Con esta funcion le indicamos a la variable donde mostramos el error, que cosas del error no queremos enviar, por ejemplo el value ya que esta es la que trae la contraseña encriptada
        const validationOpt = { validationError: { target: false, value: false }};
        
        //Si hubo algun error nos dira cual es
        const errors = await validate(user, validationOpt);
        console.log('ERR=>',errors);
        if (errors.length >0) {
            return res.status(400).json(errors);
        }

        // try to save user
        try {
            await userRepository.save(user);
        } catch (e) {
            return res.status(409).json({ msessage: 'Username already in use'});
        }

        res.status(201).json({message:'User update'});

    } 

    static deleteUser = async (req: Request, res: Response) => {
        const {id} = req.params;
        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (e) {
            return res.status(400).json({message: 'User not found'});
        }

        //remove

        userRepository.delete(id);
        res.status(201).json({message: 'User deleted'})
    };
}

export default UserController; 