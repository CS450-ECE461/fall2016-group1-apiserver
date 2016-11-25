var users = require("./users");

module.exports = [
  {
    "members": [
      users[0]._id,
      users[1]._id
    ]
  },
  {
    "members": [
      users[1]._id,
      users[2]._id
    ]
  },
  {
    "members": [
      users[2]._id,
      users[0]._id
    ]
  }
];
