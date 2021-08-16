import { getRepository } from "typeorm";
import { json, Request, Response  } from "express";
import { User } from "../entity/User";
import { request } from "http";
import { resolveModuleName } from "typescript";
import config from "../config/config";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";



class AuthController {
    static login = async (req: Request, res: Response) => {
        const {username, password, role} = req.body;
        if ( !(username && password)) {
            return res.status(400).json ({message: ' Username & Password are required!'});
            
        }

        const userRepository = getRepository(User);
        let user: User;

        var userFinded = false;
        //res.status(400).json({message:' usuario es '+username});
        try {
            //con esto buscar un valor especifico en el campo username de la tabla user
            //user = await userRepository.findOneOrFail ({ where: {username:"yolo4"}});
            
            //con esto buscar el valor recibido por json con la variable username especifico en el campo username de la tabla user
            //user = await userRepository.findOneOrFail ({ where: {username:username}});

            //Con este el busca todo lo que recibiistes por json (osea el username) tal cual con los mismo nombres, si el json y los campos se llaman iguales
            user = await userRepository.findOneOrFail ({ where: {username}});
            userFinded = true;

            // CHeck password
            if (!user.checkPassword(password)){
                user = await userRepository.findOneOrFail ({ where: {password}});
            }

        }catch (e) {
            var mens = (userFinded==false)? "Username":"Password";
            return res.status(400).json({message: mens+' incorrecct!'});
        }

        const token = jwt.sign({userId: user.id, username: user.username}, config.jwtSecret, {expiresIn: '1h'});

        res.json({message: 'Ok', token});
        //res.send("Ha iniciado Sesion correctamente");

    };

    static changePassword = async (req: Request, res: Response) => {
        const {userId} = res.locals.jwtPayload;
        const {oldPassword, newPassword} = req.body;

        if (!(oldPassword && newPassword))
        {
            res.status(400).json({message: 'Old password & new password are requierd'});
        }

        const userRespository = getRepository(User);
        let user: User;

        try {
            user = await userRespository.findOneOrFail(userId);

        }catch (e) {
            res.status(400).json({message: 'Something goes wrong'});

        }

        //return res.status(401).json({message: user.checkPassword2(oldPassword)});

        

        if (!user.checkPassword(oldPassword)) {
            return res.status(401).json({message: 'Check your old Password '+oldPassword});
        }
 
        user.password = newPassword;
        const validationOps = {validationError:{target:false, value: false}};
        const errors = await validate (user, validationOps);

        if (errors.length > 0){
            return res.status(400).json(errors);
        };

        // Hash Password
        user.hashPassword();
        userRespository.save(user);

        res.json ({message: 'Password change!'});

    }; 
}
export default AuthController;