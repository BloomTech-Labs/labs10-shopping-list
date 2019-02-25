const stripe = require('stripe')(process.env.STRIPE_SECRET);
const db = require('../data/config.js');
const express = require('express');
const router = express.Router();

router.post('/yearly', async(req, res) => {
    const {token} = req.query;
    const res = await stripe.create.charges({
        amount:'999',
        source: token,
        currency:'USD'
    })
    res.json({res});
});

router.post('/premium', async(req, res) => {
    const {token} = req.query;
    const res = await stripe.create.charges({
      amount:'2999',
      source: token,
      currency:'USD',
    })
    res.json({res});
});