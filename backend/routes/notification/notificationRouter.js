const express = require('express');
const notificationRouter = express.Router();
const notificationDb = require('../../helpers/notificationsModel');

const checkJwt = require('../../validators/checkJwt');
// checkJwt middleware authenticates user tokens and ensures they are signed correctly in order to access our internal API

/****************************************************************************************************/
/** THIS ROUTER HANDLES ALL REQUESTS TO THE /api/notifcation ENDPOINT **/
/****************************************************************************************************/

/** ADD GROUP TO DATABASE
 * @param notification = {userID: id of the user's notification content, content: "Content of the notification"}, this is gathered from the @param req.body
 * @return userID = user ID that the notification belongs to. Not nullable.
 * ID is generated upon notification creation
 * @param notification.content is the content of the notification. Not nullable.
 *
 * ***********************************************/

/** ADD NOTIFICATION
 * @TODO Add middleware to ensure user is logged in
 * **/
notificationRouter.post('/', (req, res) => {
    let notif = req.body;
    notificationDb.add(notif).then(id => {
        return res.status(200).json({message: "Notification successfully added.", id: id[0]})

    }).catch(err => {
        const error = {
            message: `Internal Server Error - Adding Notification`,
            data: {
                err: err
            },
        }
        return res.status(500).json(error);
    })
})

/**************************************************/

/** GET NOTIFICATION BY ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
notificationRouter.get('/:id', (req, res) => {
    const id = req.params.id;

    notificationDb.getById(id).then(notif => {
        if (notif.length >= 1) {
            return res.status(200).json({data: notif[0]});
        }
        return res.status(404).json({error: `The requested notification does not exist.`});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

/**************************************************/

/** GET NOTIFICATION BY USER ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
notificationRouter.get('/user/:id', (req, res) => {
    const id = req.params.id;

    notificationDb.getByUser(id).then(notif => {
        if (notif.length >= 1) {
            return res.status(200).json({data: notif[0]});
        }
        return res.status(404).json({error: `The requested notification does not exist.`});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

/**************************************************/

// GET ALL NOTIFICATIONS
/** @TODO This should be set to sysadmin privileges for group privacy **/

/**************************************************/

notificationRouter.get('/', (req, res) => {
    notificationDb.get().then(notifs => {
        if(notifs.length >= 1){
            return res.status(200).json({data: notifs });
        }

        return res.status(404).json({message: "The requested notifications do not exist."});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Getting All Notifications`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

/**************************************************/
/**
 * UPDATE NOTIFICATION
 * @TODO Add middleware to ensure users can only change their own group information
 */

/**************************************************/
notificationRouter.put('/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    notificationDb.update(id, changes).then(status => {
        if(status.length >= 1 || !status){
            return res.status(200).json({message: `Notification successfully updated.`, id: Number(id)});
        }

        return res.status(404).json({error: `The requested notification does not exist.`});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Updating Notification`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

/**************************************************/

/** DELETE NOTIFICATION
 * @TODO Add middleware to prevent unauthorized deletions
 * **/

/**************************************************/

notificationRouter.delete('/:id', (req, res) => {
    const id = req.params.id;

    notificationDb.remove(id).then(cid => {
        res.status(200).json({message: "Notification successfully deleted.", id: Number(cid)})

    }).catch(err => {
        const error = {
            message: `Internal Server Error. - Removing Notification`,
            data: {
                err: err
            },
        }
        return res.status(500).json(error);
    })


})

module.exports = notificationRouter;