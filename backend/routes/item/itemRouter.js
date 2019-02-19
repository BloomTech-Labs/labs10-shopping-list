const express = require('express');
const itemRouter = express.Router();
const itemDb = require('../../helpers/itemModel');

const checkJwt = require('../../validators/checkJwt');
// checkJwt middleware authenticates user tokens and ensures they are signed correctly in order to access our internal API

/****************************************************************************************************/
/** THIS ROUTER HANDLES ALL REQUESTS TO THE /api/item ENDPOINT **/
/****************************************************************************************************/

/** ADD SUBSCRIPTION TO DATABASE
 * @param item = {name: "name of item", groupId: id of group it belongs to, "price": price of the item, "quantity": how much of the amount}, this is gathered from the @param req.body
 * @return id = Item ID primary key in items table (e.g. 1, 3, 22, etc.);
 * ID is generated upon item creation
 * @param item.name is the name of the item. Not nullable.
 * @param item.groupId is the cost of the item. Not nullable.
 * @param item.purchasedBy is the user who purchased the item. Nullable.
 * @param item.purchased is to show is this item purchased or not.
 * @param item.price is the price of the item. Not nullable.
 * @param item.quantity is the quantity of the item. Not nullable.
 * @param item.measurement is the measurement/unit of the item. (e.g. lbs, bushels). Nullable.
 * @param item.purchasedOn is the date that the item was purchased on. Nullable.
 *
 * ***********************************************/

/** ADD SUBSCRIPTION
 * @TODO Add middleware to ensure user is logged in
 * **/
itemRouter.post('/', (req, res) => {
    console.log(req.body);
    let item = req.body;
    itemDb.add(item).then(id => {
        console.log(id);
        return res.status(200).json({message: `Item added to database with ID ${id[0]}`, id: id[0]});
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Error when adding item.`});
        })
})

/**************************************************/

/** GET SUBSCRIPTION BY ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
itemRouter.get('/:id', (req, res) => {
    const id = req.params.id;

    itemDb.getById(id).then(item => {
        console.log(item);
        if(!item){
            return res.status(404).json({error: `Item with ID ${id} does not exist.`});
        } else {
            return res.status(200).json(item);
        }
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Error retrieving item with ID ${id}.`});
        })
})

/**************************************************/

// GET ALL SUBSCRIPTIONS
/** @TODO This should be set to sysadmin privileges for subscription privacy **/

/**************************************************/

itemRouter.get('/', (req, res) => {
    itemDb.get().then(items => {
        console.log(items);
        if(!items){
            return res.status(404).json({error: `No items found!`});
        } else {
            return res.status(200).json(items);
        }
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Error collecting item information.`});
        })
})

/**************************************************/
/**
 * UPDATE SUBSCRIPTION
 * @TODO Add middleware to ensure users can only change their own group information
 */

/**************************************************/
itemRouter.put('/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    itemDb.update(id, changes).then(status => {
        if(!status || status !== 1){
            return res.status(404).json({error: `No item found with ID ${id}.`});
        } else {
            return res.status(200).json({message: `Item ${id} successfully updated.`});
        }
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Error updating item with ID ${id}.`});
        })
})

/**************************************************/

/** DELETE SUBSCRIPTION
 * @TODO Add middleware to prevent unauthorized deletions
 * **/

/**************************************************/

itemRouter.delete('/:id', (req, res) => {
    const id = req.params.id;

    itemDb.remove(id).then(status => {
        console.log(status);
        if(!status || status !== 1){
            return res.status(404).json({error: `No item found with ID ${id}.`});
        } else {
            return res.status(200).json({message: `Item with ID ${id} deleted successfully.`});
        }
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Error deleting item with ID ${id}.`});
        })
})

module.exports = itemRouter;