import { UserController } from '../controller/UserController';
import {Router} from 'express';
import { checkJwt } from '../middleware/jwt';
import { checkRole } from '../middleware/role';

const router = Router ();

// Get all users
router.get('/', UserController.getAll);

// Get all users
router.get('/:id', [checkJwt, checkRole(['admin'])], UserController.getById);

// Create a new user
router.post('/', [checkJwt, checkRole(['admin'])], UserController.newUser);

// Edit user
router.patch('/:id', [checkJwt, checkRole(['admin'])], UserController.editUser);

// Delete
router.delete('/:id', [checkJwt, checkRole(['admin'])], UserController.deleteUser);

export default router;

