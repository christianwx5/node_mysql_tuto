import {Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn} from "typeorm";
import {MinLength, IsNotEmpty, IsEmail } from 'class-validator';
import * as bcrypt from 'bcryptjs';
// TODO IsEmail

@Entity()
@Unique(['username'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    @MinLength(6)
    //@IsEmail()
    @IsNotEmpty()
    username: string;

    @Column()
    @MinLength(6)
    password: string;

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updateAt: Date;

    hashPassword(): void {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password,salt);
    }

    checkPassword(password:string):boolean {

        if (!bcrypt.compareSync(password,this.password)&&!(password==this.password)){
            
            return false;
        }else {
            return true;
        }
        
    }

    checkPassword2(password:string):string {

        if (!bcrypt.compareSync(password,this.password)){
            return password+" "+this.password;
        }
        
        return "todo bello ";
    }
}
