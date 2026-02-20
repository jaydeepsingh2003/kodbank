const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const transactionController = require('../controllers/transactionController');
const cardController = require('../controllers/cardController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/balance', verifyToken, userController.getBalance);
router.post('/transfer', verifyToken, transactionController.transferMoney);
router.get('/history', verifyToken, transactionController.getHistory);
router.get('/cards', verifyToken, cardController.getCards);

module.exports = router;
