const express = require('express');
const itemRouter = express.Router();
const itemDb = require('../../helpers/itemModel');

const checkJwt = require('../../validators/checkJwt');
const checkUser = require('../../validators/checkUser');
// checkJwt middleware authenticates user tokens and ensures they are signed correctly in order to access our internal API

/****************************************************************************************************/
/** THIS ROUTER HANDLES ALL REQUESTS TO THE /api/item ENDPOINT **/
/****************************************************************************************************/

/** ADD ITEM TO DATABASE
 * @param item = {name: "name of item", groupId: id of group it belongs to, "price": price of the item, "quantity": how much of the amount}, this is gathered from the @param req.body
 * @return id = Item ID primary key in items table (e.g. 1, 3, 22, etc.);
 * ID is generated upon item creation
 * @param item.name is the name of the item. Not nullable.
 * @param item.groupId is the id of the group. Not nullable.
 * @param item.purchasedBy is the user who purchased the item. Nullable.
 * @param item.purchased is to show is this item purchased or not.
 * @param item.price is the price of the item. Not nullable.
 * @param item.quantity is the quantity of the item. Not nullable.
 * @param item.measurement is the measurement/unit of the item. (e.g. lbs, bushels). Nullable.
 * @param item.purchasedOn is the date that the item was purchased on. Nullable.
 *
 * ***********************************************/

itemRouter.use(checkJwt);
// itemRouter.use(checkUser);

/** ADD ITEM
 * @TODO Add middleware to ensure user is logged in
 * **/
itemRouter.post('/', (req, res) => {
    const item = req.body;

    itemDb.add(item).then(id => {
        return res.status(200).json({message: `Item successfully added`, id: id[0]});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Adding Item`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

/**************************************************/

/** GET ITEM BY ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
itemRouter.get('/:id', (req, res) => {
    const id = req.params.id;

    itemDb.getById(id).then(item => {
        if (item.length >= 1) {
            return res.status(200).json({data: item})
        }

        return res.status(404).json({message: "The requested item does not exist."});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Retrieving Item`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

/**************************************************/

/** GET ITEM BY GROUP ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
itemRouter.get('/group/:id', (req, res) => {
    const id = req.params.id;

    itemDb.getByGroup(id).then(item => {
        if (item.length >= 1) {
            return res.status(200).json({data: item})
        }

        return res.status(404).json({message: "The requested item does not exist."});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Retrieving Item`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

/**************************************************/

// GET ALL ITEMS
/** @TODO This should be set to sysadmin privileges for subscription privacy **/

/**************************************************/

itemRouter.get('/', (req, res) => {
    itemDb.get().then(items => {
        if(items.length >= 1) {
            return res.status(200).json({data: items});
        }

        return res.status(404).json({message: `The requested items do not exist.`})
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Getting Items`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

/**************************************************/
/**
 * UPDATE ITEM
 * @TODO Add middleware to ensure users can only change their own group information
 */

/**************************************************/
itemRouter.put('/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    itemDb.update(id, changes).then(status => {
        if (status.length >= 1) {
            return res.status(200).json({message: "Item updated successfully", id: status[0]})
        }

        return res.status(404).json({message: "The requested item does not exist."});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Updating Item`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

/**************************************************/

/** DELETE ITEM
 * @TODO Add middleware to prevent unauthorized deletions
 * **/

/**************************************************/

itemRouter.delete('/:id', (req, res) => {
    const id = req.params.id;

    itemDb.remove(id).then(status => {
        if (status.length >= 1) {
            return res.status(200).json({message: "Item removed successfully", id: status[0]})
        }

        return res.status(404).json({message: "The requested item does not exist."});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Removing Item`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

module.exports = itemRouter;