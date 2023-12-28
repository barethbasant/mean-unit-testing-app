"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Task.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        get() {
          const rawValue = this.getDataValue("dueDate");
          return rawValue
            ? new Date(rawValue).toISOString().split("T")[0]
            : null;
        },
        set(value) {
          this.setDataValue("dueDate", value);
        },
      },
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Task",
    }
  );
  return Task;
};
