# Pusher Notification Channels and Action Types

Every group will have its own Pusher channel designated by their groupID.

So the channel for group 4 will be `group-4`.

These are the action-types that can be received by subscribing to a group's pusher channel:

`add-item`
`update-item`
`delete-item`

Each action contains a message that gives more details as to who performed the action, which items are affected and which group-name is concerned. 

Each action will send a JSON via Pusher with the action information in the `message` parameter, as well as a timestamp of when the action was triggered in the `timestamp` parameter. 

As notifications are stored in the database, their moment of execution is also stored in the `createdAt` column in the database table.

More action-types to follow, thank you for your patience.

-Adam