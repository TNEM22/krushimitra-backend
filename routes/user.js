const express = require('express');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// router.patch('/updatePassword', authController.updatePassword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

router.delete('/deleteMe', authController.protect, userController.deleteMe);

router
  .route('/experts')
  .get(userController.getExperts)
  .post(authController.protect, userController.updateExpert);

router
  .route('/experts/book')
  .post(authController.protect, userController.appointExpert)
  .delete(authController.protect, userController.rejectExpert);

router.route('/farmer/:id').get(userController.getFarmer);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
