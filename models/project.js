'use strict';
module.exports = (sequelize, DataTypes) => {
  var project = sequelize.define('project', {
    project_name: DataTypes.STRING,
    description: DataTypes.TEXT,
    cloudinary_url: DataTypes.TEXT,
    ascii_url: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {});
  project.associate = function(models) {
    // associations can be defined here
    models.project.belongsTo(models.user);
  };
  return project;
};