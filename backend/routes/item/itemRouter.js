const express = require('express');
const itemRouter = express.Router();
const itemDb = require('../../helpers/itemModel');
const notificationDb = require('../../helpers/notificationsModel');
const groupDb = require('../../helpers/groupModel');
const userDb = require('../../helpers/userModel');

const checkJwt = require('../../validators/checkJwt');
const checkUser = require('../../validators/checkUser');
// checkJwt middleware authenticates user tokens and ensures they are signed correctly in order to access our internal API
const moment = require('moment');

var Pusher = require('pusher');

var pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    encrypted: true
  });
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

/** ADD ITEM
 * @TODO Add middleware to ensure user is logged in
 * /** Each time an item is added to a group, a notification should fire for that group's channel
         * Additionally, the event should be stored into the notifications table for future review
         * The notifications table will need to contain a record of the:
         *      userID
         *      groupID
         *      time of action
         *      type of action
         *      
         */
itemRouter.post('/', (req, res) => {
    const item = req.body;
    let groupID = item.groupID;

    itemDb.add(item).then(id => {
        // get group and user information for notification
        // we can assume the user in req.user is performing this action via checkJwt
        let notification = {};
        // can we abstract this into a function?
        userDb.getProfileByEmail(req.user.email).then(user => {
            notification.userID = user[0].id;
            notification.userName = user[0].name;

            groupDb.getById(groupID).then(group => {
                notification.groupID = group[0].id;
                notification.groupName = group[0].name;
                notification.action = 'add-item';
                notification.content = `${notification.userName} added ${item.name} to the ${notification.groupName} shopping list.`

                pusher.trigger(`group-${groupID}`, 'add-item', {
                    "message": `${notification.userName} added ${item.name} to the ${notification.groupName} shopping list.`,
                    "timestamp": moment().format()
                })

                console.log('NOTIFICATION\n\n', notification);

                notificationDb.add(notification).then(response => {
                    console.log('notification added', response);
                    return res.status(200).json({message: `Item successfully added`, id: id[0]});
                })
            })
        })        
    }).catch(err => {
        console.log(err);
        return res.status(500).json(err);
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
    let id = req.params.id;
    let changes = req.body;
    // changes.price = parseFloat(changes.price);
    console.log('id, changes', id, changes);
    itemDb.getById(id).then(item => {
        let oldItem = item[0];

        itemDb.update(id, changes).then(status => {
            console.log('item update', status);

            if (status.length >= 1 || status === 1) {
                    let notification = {};
                    userDb.getProfileByEmail(req.user.email).then(user => {
                        notification.userID = user[0].id;
                        notification.userName = user[0].name;
        
                        itemDb.getById(id).then(newItem => {
                            let groupID = newItem[0].groupID;
        
                            groupDb.getById(groupID).then(group => {
                                notification.groupID = group[0].id;
                                notification.groupName = group[0].name;
                                notification.action = 'update-item';
                                notification.content = `${notification.userName} updated ${oldItem.name} to ${newItem[0].name} in the ${notification.groupName} shopping list.`
        
                                pusher.trigger(`group-${groupID}`, 'update-item', {
                                    "message": `${notification.userName} updated ${oldItem.name} to ${newItem[0].name} in the ${notification.groupName} shopping list.`,
                                    "timestamp": moment().format()
                                })
        
                                console.log('NOTIFICATION\n\n', notification);
        
                                notificationDb.add(notification).then(response => {
                                    console.log('notification added', response);
                                    return res.status(200).json({message: "Item updated successfully", id: status[0]})                                    
                                })
                            })
                        })
                    })
                } else {
                    return res.status(404).json({message: "The requested item does not exist."});
                }
        })
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
    itemDb.getById(id).then(item => {
        let groupID = item[0].groupID;
        let oldItem = item[0];
        itemDb.remove(id).then(status => {
            console.log('remove status', status)
            if (status.length >= 1 || status === 1) {
                let notification = {};
                    userDb.getProfileByEmail(req.user.email).then(user => {
                        notification.userID = user[0].id;
                        notification.userName = user[0].name;
        
                            groupDb.getById(groupID).then(group => {
                                notification.groupID = group[0].id;
                                notification.groupName = group[0].name;
                                notification.action = 'delete-item';
                                notification.content = `${notification.userName} removed ${oldItem.name} from the ${notification.groupName} shopping list.`
        
                                pusher.trigger(`group-${groupID}`, 'delete-item', {
                                    "message": `${notification.userName} removed ${oldItem.name} from the ${notification.groupName} shopping list.`,
                                    "timestamp": moment().format()
                                })
        
                                console.log('NOTIFICATION\n\n', notification);
        
                                notificationDb.add(notification).then(response => {
                                    console.log('notification added', response);
                                    return res.status(200).json({message: "Item removed successfully", id: status[0]})                               
                                })
                            })
                        })
            } else {
                return res.status(404).json({message: "The requested item does not exist."});
            }

        })
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