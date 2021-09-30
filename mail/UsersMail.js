module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_mail', {
		user_id: DataTypes.STRING,
		sender_id: DataTypes.STRING,
		message: DataTypes.TEXT,
		timestamp: DataTypes.DATE,
		read: DataTypes.BOOLEAN,
	});
};