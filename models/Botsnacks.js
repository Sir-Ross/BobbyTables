module.exports = (sequelize, DataTypes) => {
	return sequelize.define('botsnacks', {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		cost: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};