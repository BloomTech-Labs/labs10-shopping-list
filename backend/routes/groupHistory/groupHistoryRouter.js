const express = require('express');
const groupHistoryRouter = express.Router();
const groupHistoryDb = require('../../helpers/groupHistoryModel');
const itemDb = require('../../helpers/itemModel');
const userDb = require('../../helpers/userModel');

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
    const groupId = req.params.id;
    const groups = [];

    try {
        const grpHistory = await groupHistoryDb.getByGroup(groupId);

        // Loop through the history and gather information on the item and user
        for (let i = 0; i < grpHistory.length; i++) {
            // Gather the item
            const mem = await itemDb.getById(grpHistory[i].itemID);

            // Gather the user
            const usr = await userDb.getById(mem[0].purchasedBy);

            // Create an item object to return
            const item = {
                id: mem[0].id,
                name: mem[0].name,
                user: usr[0].name,
                price: mem[0].price,
            }

            // The overall history object to return
            const hist = {
                total: grpHistory[i].total,
                item: item,
                name: mem[0].name,
                user: usr[0].name,
                date: new Date(grpHistory[i].createdAt).toLocaleDateString(),
                utcDate: new Date(grpHistory[i].createdAt).toUTCString()
            }

            // Add to the groups array
            groups.push(hist);
        }

        // Sort the array by the item's date (2/27/2019) and user(name)
        const results = groupBy(groups, function(itm) {
            return [itm.date, itm.user]
        })

        // Map a new array to use for calculating the total. This sets any item that was purchased on the same
        // date/time to a total of 0 so it does not get recalculated
        let result = results.map((x, i) => {

            // Check the utcDate to see if they match, if so, return a new object overwriting the prev with a total 0
            // else, return the original object
            let rr = x.map((y, iy) => {
                if (results[i][iy-1] && results[i][iy].utcDate === results[i][iy - 1].utcDate) {
                    return {total: 0};
                } else {
                    return y;
                }
            })

            return rr;

        });

        // Create a new array
        let newSorted = results.map(x => x);

        // Calculate the total and send to te newSorted array
        result.forEach((rs, i) => {
            let total = totalItems(result[i]);
            const grandTotal = {
                grandTotal: total,
            }
            newSorted[i].push(grandTotal);
        })

        // Finally, reverse the order to have the newest dates first.
        const sorted = newSorted.reverse();

        return res.status(200).json({data: sorted });

    } catch (e) {
        return res.status(500).json({message: "Internal Server Error", err: e})
    }
});

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

module.exports = groupHistoryRouter;