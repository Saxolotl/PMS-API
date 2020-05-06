const Sequelize = require('sequelize');

module.exports.db = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite'
});

module.exports.Users = this.db.define('Users', {
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

module.exports.Projects = this.db.define('Projects', {
    name: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    budget: {
        type: Sequelize.FLOAT
    }
});

module.exports.Deadlines = this.db.define('Deadlines', {
    date: {
        type: Sequelize.DATE
    },
    name : {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    ProjectId: {
        type: Sequelize.INTEGER
    }
});

module.exports.Meetings = this.db.define('Meetings', {
    date: {
        type: Sequelize.DATE
    },
    name : {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    ProjectId: {
        type: Sequelize.INTEGER
    }
});

module.exports.Devices = this.db.define('Devices', {
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

module.exports.seed = async () => {
    this.Projects.hasMany(this.Deadlines);
    this.Projects.hasMany(this.Meetings);

    this.Deadlines.belongsTo(this.Projects);
    this.Meetings.belongsTo(this.Projects);

    this.Users.belongsToMany(this.Projects, {through: 'UserProjects'});
    this.Projects.belongsToMany(this.Users, {through: 'UserProjects'});

    this.db.sync();
}