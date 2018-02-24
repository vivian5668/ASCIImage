'use strict';

var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    name: {
    	type: DataTypes.STRING,
    	validate: {
    		len: {
    			args: [1,99],
    			msg: 'Invalid user name. Must be between 1-99 chars'
    		}
    	}
    },
    email: {
    	type: DataTypes.STRING,
    	validate: {
    		isEmail: {
    			msg: 'Invalid email address'
    		}
    	}
    },
    password: {
    	type: DataTypes.STRING,
    	validate: {
    		len: {
    			args: [8,99],
    			msg: 'Password must be at least 8 characters',
    			
    		}
    	}
    }
  }, {
    hooks: {  //sequelize, before you write password, do this
        beforeCreate: function(pendingUser, opstions) { //diff from WDI notes b/c we are using sequelize 4.
            if(pendingUser && pendingUser.password) {  //if pendingUse is undefined, don't execute this block
                var hash = bcrypt.hashSync(pendingUser.password, 10); //10 is salt rounds = how many times it will be hashed, but increased exponentially
                pendingUser.password = hash;
            }
        }
    }
  });

  user.associate = function(models) { //WDI notes doesn't apply, we use sequelize 4.
    // associations can be defined here
  };

  //attaching method to a class, so it is inheritable, like array on MDN docs
  //to see if 'isValidPassword?'
  user.prototype.validPassword = function(passwordTyped) {
    //compareSync compares the hashed one and the typed one to compare
    return bcrypt.compareSync(passwordTyped, this.password); //'this' is an instance of the model
  }
 
  //remove sensitive information
  user.prototype.toJSON = function() {
    var userData = this.get();
    delete userData.password;
    return userData;
  }

  return user;
};




