const express = require('express');
const categoryRouter = express.Router();
const categoryDb = require('../../helpers/categoryModel');

const checkJwt = require('../../validators/checkJwt');
// checkJwt middleware authenticates user tokens and ensures they are signed correctly in order to access our internal API

/****************************************************************************************************/
/** THIS ROUTER HANDLES ALL REQUESTS TO THE /api/category ENDPOINT **/
/****************************************************************************************************/

/** ADD GROUP TO DATABASE
 * @param category = {category: "name of the category"}, this is gathered from the @param req.body
 * @return id = category ID primary key in categories table (e.g. 1, 3, 22, etc.);
 * ID is generated upon category creation
 * @param category.category is the name of the category. Not nullable.
 *
 * ***********************************************/

/** ADD CATEGORY
 * @TODO Add middleware to ensure user is logged in
 * **/
categoryRouter.post('/', (req, res) => {
    let category = req.body;
    categoryDb.add(category).then(id => {
        return res.status(200).json({message: "Category successfully added.", id: id[0]})

    }).catch(err => {
        const error = {
            message: `Internal Server Error - Adding Category`,
            data: {
                err: err
            },
        }
        return res.status(500).json(error);
    })
})

/**************************************************/

/** GET CATEGORY BY ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
categoryRouter.get('/:id', (req, res) => {
    const id = req.params.id;

    categoryDb.getById(id).then(cat => {
        if (cat.length >= 1) {
            return res.status(200).json({data: cat[0]});
        }
        return res.status(404).json({error: `The requested category does not exist.`});
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

/** GET CATEGORY BY CATEGORY
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
categoryRouter.get('/:category', (req, res) => {
    const name = req.params.category;

    categoryDb.getByCategory(name).then(cat => {
        if (cat.length >= 1) {
            return res.status(200).json({data: cat[0]});
        }
        return res.status(404).json({error: `The requested category does not exist.`});
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

// GET ALL CATEGORIES
/** @TODO This should be set to sysadmin privileges for group privacy **/

/**************************************************/

categoryRouter.get('/', (req, res) => {
    categoryDb.get().then(cats => {
        if(cats.length >= 1){
            return res.status(200).json({data: cats });
        }

        return res.status(404).json({message: "The requested categories do not exist."});
    })
        .catch(err => {
            const error = {
                message: `Error collecting category information.`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

/**************************************************/
/**
 * UPDATE CATEGORY
 * @TODO Add middleware to ensure users can only change their own group information
 */

/**************************************************/
categoryRouter.put('/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    categoryDb.update(id, changes).then(status => {
        if(status.length >= 1 || !status){
            return res.status(200).json({message: `Category successfully updated.`, id: Number(id)});

        } else {
            return res.status(404).json({error: `The requested category does not exist.`});
        }
    })
        .catch(err => {
            const error = {
                message: `Error updating category.`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

/**************************************************/

/** DELETE CATEGORY
 * @TODO Add middleware to prevent unauthorized deletions
 * **/

/**************************************************/

categoryRouter.delete('/:id', (req, res) => {
    const id = req.params.id;

    categoryDb.remove(id).then(cid => {
        res.status(200).json({message: "Category successfully deleted.", id: Number(cid)})

    }).catch(err => {
        const error = {
            message: `Error removing category.`,
            data: {
                err: err
            },
        }
        return res.status(500).json(error);
    })


})

module.exports = categoryRouter;