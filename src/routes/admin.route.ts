import express from 'express';
import adminController from '../controller/admin.controller.ts';
const router=express.Router();

router.post('/get-teams',adminController.getTeams);
router.post('/accept-team',adminController.acceptTeam);
router.post('/reject-team',adminController.rejectTeam);
router.get('/getCount',adminController.getTeam);
router.post('/login',adminController.login);
router.post('/logout',adminController.logout);
export default {router};