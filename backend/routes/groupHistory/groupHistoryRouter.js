const express = require('express');
const groupHistoryRouter = express.Router();
const groupHistoryDb = require('../../helpers/groupHistoryModel');
const itemDb = require('../../helpers/itemModel');
const userDb = require('../../helpers/userModel');

const checkJwt = require('../../validators/checkJwt');
// checkJwt middleware authenticates user tokens and ensures they are signed correctly in order to access our internal API

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
    if(!groupHistory.groupID || typeof(groupHistory.groupID) !== 'number') return res.status(404).json({message: `groupID does not exist or is invalid.`});
    if(!groupHistory.userID || typeof(groupHistory.userID) !== 'number') return res.status(404).json({message: `userID does not exist or is invalid.`});
    console.log("COR");
    groupHistoryDb.add(groupHistory).then(id => {
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
function groupBy( array , f )
{
    var groups = {};
    array.forEach( function( o )
    {
        var group = JSON.stringify( f(o) );
        groups[group] = groups[group] || [];
        groups[group].push( o );
    });
    return Object.keys(groups).map( function( group )
    {
        return groups[group];
    })
}

groupHistoryRouter.get('/group/:id', async (req, res) => {
    const groupId = req.params.id;
    const groups = [];

    try {
        const grpHistory = await groupHistoryDb.getByGroup(groupId);

        // console.log("GRPHISTORY => ", grpHistory);

        for (let i = 0; i < grpHistory.length; i++) {
            const mem = await itemDb.getById(grpHistory[i].itemID);

            const usr = await userDb.getById(mem[0].purchasedBy);

            // console.log("MEM => ", mem);
            // console.log("USR => ", usr[0].name);



            const item = {
                id: mem[0].id,
                name: mem[0].name,
                user: usr[0].name,
                price: mem[0].price,
            }

            // console.log(item);

            const hist = {
                total: grpHistory[i].total,
                item: item,
                name: mem[0].name,
                user: usr[0].name,
                date: new Date(grpHistory[i].createdAt).toLocaleDateString(),
            }

            // console.log("HIST => ", hist);
            groups.push(hist);
        }

        // console.log(groups);
        let newGroups = [];


        const sorted = groups.sort((a,b) => {
            if (a.item.user > b.item.user ) return -1;
            if (a.item.user  < b.item.user ) return 1;

            if (a.date > b.date) return -1;
            if (a.date < b.date) return 1;
        })

        const result = groupBy(groups, function(itm) {
            return [itm.date, itm.user]
        })

        console.log(result);

        return res.status(200).json({data: result });

    } catch (e) {
        return res.status(500).json({message: "Internal Server Error", err: e})
    }
    // groupHistoryDb.getByGroup(groupId).then(groupHistories => {
    //
    //     console.log("GROUPS => ", groupHistories);
    //
    //
    //
    //     if (groupHistories.length >= 1) {
    //         return res.status(200).json(groupHistories);
    //     }
    //     return res.status(404).json({message: "The requested group histories do not exist."});
    // })
    // .catch(err => {
    //     const error = {
    //         message: `Internal Server Error - Getting Group History`,
    //         data: {
    //             err: err
    //         },
    //     }
    //     return res.status(500).json(error);
    // });
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