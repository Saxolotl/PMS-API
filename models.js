const Sequelize = require('sequelize');

module.exports.db = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite'
});

module.exports.Users = this.db.define('users', {
    email: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    password: {
        type: Sequelize.STRING
    },
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    }
});

module.exports.Projects = this.db.define('projects', {
    name: {
        type: Sequelize.STRING
    },
    
});

module.exports.Deadlines = this.db.define('deadlines', {
    date: {
        type: Sequelize.DATE
    },
    name : {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
})

module.exports.Devices = this.db.define('devices', {
    deviceType: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    serialNumber: {
        type: Sequelize.STRING
    }
})

module.exports.init = async () => {
    await this.Users.sync({force: true});
    console.log("Updated Table");
}

module.exports.seed = async () => {
    this.Projects.hasMany(this.Deadlines);
    this.Deadlines.belongsTo(this.Projects);

    this.Users.belongsToMany(this.Projects, {through: 'UserProjects'});
    this.Projects.belongsToMany(this.Users, {through: 'UserProjects'});

    this.db.sync();
}