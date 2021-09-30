const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = sequelize.import('mail/Users');
const UsersMail = sequelize.import('mail/UsersMail');

UsersMail.belongsTo(Users, {foreignKey: 'user_id', as: 'id'});

Users.prototype.addMail = async function(id){
	const userMail = await UsersMail.findOne({
		where: { sender_id: this.sender_id, user_id: id.id },
	});

	if(userMail){
		
	}
}