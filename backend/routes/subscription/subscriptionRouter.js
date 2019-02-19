const express = require('express');
const subscriptionRouter = express.Router();
const subDb = require('../../helpers/subscriptionModel');

const checkJwt = require('../../validators/checkJwt');
// checkJwt middleware authenticates user tokens and ensures they are signed correctly in order to access our internal API

/****************************************************************************************************/
/** THIS ROUTER HANDLES ALL REQUESTS TO THE /api/subscription ENDPOINT **/
/****************************************************************************************************/

/** ADD SUBSCRIPTION TO DATABASE
 * @param sub = {name: "name of subscription", amount: cost}, this is gathered from the @param req.body
 * @return id = subscription ID primary key in subscriptions table (e.g. 1, 3, 22, etc.);
 * ID is generated upon subscription creation
 * @param sub.name is the name of the subscription. Not nullable.
 * @param sub.amount is the cost of the subscription. Not nullable.
 *
 * ***********************************************/

/** ADD SUBSCRIPTION
 * @TODO Add middleware to ensure user is logged in
 * **/
subscriptionRouter.post('/', (req, res) => {
    console.log(req.body);
    let sub = req.body;
    subDb.add(sub).then(id => {
        console.log(id);
        return res.status(200).json({message: `Subscription added to database with ID ${id[0]}`, id: id[0]});
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Error when adding subscription.`});
        })
})

/**************************************************/

/** GET SUBSCRIPTION BY ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
subscriptionRouter.get('/:id', (req, res) => {
    const id = req.params.id;

    subDb.getById(id).then(sub => {
        console.log(sub);
        if(!sub){
            return res.status(404).json({error: `Subscription with ID ${id} does not exist.`});
        } else {
            return res.status(200).json(sub);
        }
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Error retrieving subscription with ID ${id}.`});
        })
})

/**************************************************/

// GET ALL SUBSCRIPTIONS
/** @TODO This should be set to sysadmin privileges for subscription privacy **/

/**************************************************/

subscriptionRouter.get('/', (req, res) => {
    subDb.get().then(subs => {
        console.log(subs);
        if(!subs){
            return res.status(404).json({error: `No subscriptions found!`});
        } else {
            return res.status(200).json(subs);
        }
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Error collecting subscription information.`});
        })
})

/**************************************************/
/**
 * UPDATE SUBSCRIPTION
 * @TODO Add middleware to ensure users can only change their own group information
 */

/**************************************************/
subscriptionRouter.put('/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    subDb.update(id, changes).then(status => {
        if(!status || status !== 1){
            return res.status(404).json({error: `No subscription found with ID ${id}.`});
        } else {
            return res.status(200).json({message: `Subscription ${id} successfully updated.`});
        }
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Error updating subscription with ID ${id}.`});
        })
})

/**************************************************/

/** DELETE SUBSCRIPTION
 * @TODO Add middleware to prevent unauthorized deletions
 * **/

/**************************************************/

subscriptionRouter.delete('/:id', (req, res) => {
    const id = req.params.id;

    subDb.remove(id).then(status => {
        console.log(status);
        if(!status || status !== 1){
            return res.status(404).json({error: `No subscription found with ID ${id}.`});
        } else {
            return res.status(200).json({message: `Subscription with ID ${id} deleted successfully.`});
        }
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Error deleting subscription with ID ${id}.`});
        })
})

module.exports = subscriptionRouter;