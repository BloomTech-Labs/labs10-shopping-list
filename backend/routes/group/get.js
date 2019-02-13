const groupDb = require('../../helpers/group.js');

module.exports = {
  type: 'GET',
  url: '/api/group/:id',
  handler: (req, res) => {
    groupDb.get(req.params.id)
      .then(group => {
        if(group != undefined){
          res.status(200).json({ group });
        }else{
          res.status(404).json({ error: "Group not found."});
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Could not retrieve group." });
      })
  },
  //protected: true,
}