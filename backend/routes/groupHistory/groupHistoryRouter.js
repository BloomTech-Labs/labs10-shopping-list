const express = require('express');
const groupHistoryRouter = express.Router();
const groupHistoryDb = require('../../helpers/groupHistoryModel');
const itemDb = require('../../helpers/itemModel');
const userDb = require('../../helpers/userModel');
const moment = require('moment');

const checkJwt = require('../../validators/checkJwt');
groupHistoryRouter.use(checkJwt);
//checkJwt middleware authenticates user tokens and ensures they are signed correctly in order to access our internal API

/****************************************************************************************************/
/** THIS ROUTER HANDLES ALL REQUESTS TO THE /api/grouphistory ENDPOINT **/
/****************************************************************************************************/

/** ADD GROUP HISTORY TO DATABASE
 *  need to update this section once working
 *
 * ***********************************************/

/** ADD GROUP HISTORY
 * @TODO Add middleware to ensure user is logged in
 * **/
groupHistoryRouter.post('/', (req, res) => {
    const groupHistory  = req.body;
    console.log('history', groupHistory)
    if(!groupHistory.groupID || typeof(groupHistory.groupID) !== 'number') return res.status(404).json({message: `groupID does not exist or is invalid.`});
    if(!groupHistory.userID || typeof(groupHistory.userID) !== 'number') return res.status(404).json({message: `userID does not exist or is invalid.`});
    console.log("COR");
    groupHistoryDb.add(groupHistory).then(id => {
        console.log(id, 'id');
        if(id >= 1){
            return res.status(200).json({message: `Group history added.`, id: id[0]});
        }
        return res.status(400).json({message: `Failed to add.`});
    })
        .catch(err => {
            console.log(err);
            const error = {
                message: `Internal Server Error - Adding Group History`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        });
});

/**************************************************/

/** GET GROUP HISTORY BY GROUP ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
/*
 * Groups the array by user and date
 * @params array - Array to sort
 * @params f - What to sort by
 */
function groupBy( array , f )
{
    // Set a new group object
    var groups = {};

    // Loop through the array and start sorting based on the f inputs
    array.forEach( function( o )
    {
        var group = JSON.stringify( f(o) );
        groups[group] = groups[group] || [];
        groups[group].push( o );
    });

    // Return a new array of groups
    return Object.keys(groups).map( function( group )
    {
        return groups[group];
    })
}

/*
 * Calculate the total amount the member has spent
 * @params items - Array of items to tally
 */
totalItems = (items) => {
    const total = items.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.total;
    }, 0);

    return total;
}

groupHistoryRouter.get('/group/:id', async (req, res) => {
    // get group histories
    let groupID = req.params.id;

    groupHistoryDb.getByGroup(groupID).then(hist => {
        // iterate over each history and collect username and items purchased

        for(let i = 0; i < hist.length; i++){
            userDb.getById(hist[i].userID).then(user => {
                // collect username of trip
                if(!user || user.length === 0){
                    hist[i].userName = 'Removed User';
                } else {
                    hist[i].userName = user[0].name;
                }

                itemDb.getByGroup(groupID).then(items => {
                    if(!hist[i].purchasedItems){
                        // initialize an array for the purchased items
                        hist[i].purchasedItems = [];
                    }
                    for(let j = 0; j < items.length; j++){
                        if(hist[i].purchasedOn === items[j].purchasedOn){
                            hist[i].purchasedItems.push(items[j]);
                        }
                    }

                    hist[i].dateString = moment(hist[i].purchasedOn).format('LLLL')

                    if(i === hist.length - 1){
                        console.log('loop complete', hist);
                        return res.status(200).json({data: hist});
                    }
                })
            })
        }
    })



})

/**************************************************/

/** GET GROUP HISTORY BY USER ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
groupHistoryRouter.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    groupHistoryDb.getByUser(userId).then(groupHistories => {
        if (groupHistories.length >= 1) {
            return res.status(200).json({data: groupHistories});
        }
        return res.status(404).json({message: "The requested group histories do not exist."});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Getting Group History`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        });
});

/**************************************************/

/** GET GROUP HISTORY BY USER && GROUP ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
groupHistoryRouter.get('/gethistory/', (req, res) => {
    let groupHistory = req.body;
    if(!groupHistory.groupID || typeof(groupHistory.groupID) !== 'number') return res.status(404).json({message: `groupID does not exist or is invalid.`});
    if(!groupHistory.userID || typeof(groupHistory.userID) !== 'number') return res.status(404).json({message: `userID does not exist or is invalid.`});
    groupHistoryDb.getById(groupHistory.groupID, groupHistory.userID).then(groupHistories => {
        if (groupHistories.length >= 1) {
            return res.status(200).json({data: groupHistories});
        }
        return res.status(404).json({message: "The requested group histories do not exist."});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Getting Group Histories`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        });
});

/**************************************************/

// GET ALL GROUP HISTORIES
/** @TODO This should be set to sysadmin privileges for group privacy **/

/**************************************************/

groupHistoryRouter.get('/', (req, res) => {
    groupHistoryDb.get().then(groupHistories => {
        if(groupHistories){
            return res.status(200).json({data: groupHistories});
            return res.status(404).json({error: `No group histories exist.`});
        }
        return res.status(404).json({error: `No group histories exist.`});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Getting All Group Histories`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        });
});

/**************************************************/
/**
 * UPDATE GROUP HISTORY
 * @TODO Add middleware to ensure users can only change their own group information
 */

/**************************************************/
groupHistoryRouter.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    groupHistoryDb.update(id, changes).then(status => {
        console.log(status);
        if (status.length >= 1) {
            return res.status(200).json({message: "History successfully updated.", id: Number(id)});
        }
        return res.status(400).json({message: "Failed to update."});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Updating Group History`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        });
});

/**************************************************/

/** DELETE GROUP HISTORY
 * @TODO Add middleware to prevent unauthorized deletions
 * **/

/**************************************************/

groupHistoryRouter.delete('/remove/:id', (req, res) => {
    const id = req.params.id;
    groupHistoryDb.remove(id).then(status => {
        if (status.length >= 1) {
            return res.status(200).json({message: "History successfully removed.", id: Number(id)})
        }
        return res.status(400).json({message: "Failed to delete."});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Removing Group History`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        });
});

/**************************************************/

/** GET GROUP HISTORIES IDs BY USER ID
 * @TODO Add middleware to prevent unauthorized deletions
 * **/

/**************************************************/

groupHistoryRouter.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    groupHistoryDb.returnUserGroups(userId).then(status => {
        if (status.length >= 1) {
            return res.status(200).json({message: "History's group ID's successfully acquired.", id: Number(id)});
        }
        return res.status(400).json({message: "Failed to get group history."});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Getting Group History Group ID's`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        });
});


groupHistoryRouter.get('/total/group/:id', (req, res) => {
    let groupID = req.params.id;

    groupHistoryDb.getByGroup(groupID).then(data => {
        return res.status(200).json({data})
    }).catch(err => {
        console.log(err);
        return res.status(500).json({error: `Internal server error.`})
    })
})

module.exports = groupHistoryRouter;