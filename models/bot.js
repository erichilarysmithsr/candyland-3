module.exports = function(sequelize, DataTypes) {
    var Bot = sequelize.define(
        'Bot',
        {
            name: { type: DataTypes.STRING, allowNull: false, unique: true },
            target: { type: DataTypes.STRING, allowNull: false },
            queries: { type: DataTypes.TEXT, allowNull: false },
            runs: { type: DataTypes.INTEGER },
            idle: { type: DataTypes.INTEGER },
            active: { type: DataTypes.BOOLEAN, allowNull: false }
        }
    );

    return Bot;
}