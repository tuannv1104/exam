var User = require('../models/user.js');

exports.list = function(req, res){
  User.find(function(err, users) {
  	str = "";
  	users.forEach(function (member) {
            str += member.username;
            str += "; " + member.email;
            str += "; " + member.firstName;
            str += "; " + member.lastName;
            str += "\n";
        });
        //res.render('listuser', {list: JSON.stringify(users)});
        res.send(str);
   
   //res.json(users);
  });
};