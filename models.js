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

this.Users.associate = function(models) {
    this.Users.belongsToMany(models.Projects, {through: 'UserProjects', as: 'User'});
}

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

this.Projects.associate = function(models) {
    this.Projects.belongsToMany(models.Users, {through: 'UserProjects', as: 'Project'});
}

module.exports.UserProjects = this.db.define('UserProjects', {
    UserEmail: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    ProjectId: {
        type: Sequelize.INTEGER,
        primaryKey: true
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
    assetId: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    serialNumber: {
        type: Sequelize.STRING
    },
    deviceType: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
});

module.exports.seed = async () => {
    this.Projects.hasMany(this.Deadlines);
    this.Projects.hasMany(this.Meetings);
    this.Projects.hasMany(this.Devices);

    this.Deadlines.belongsTo(this.Projects);
    this.Meetings.belongsTo(this.Projects);
    this.Devices.belongsTo(this.Projects);

    this.Users.belongsToMany(this.Projects, {through: 'UserProjects', as: 'Project'});
    this.Projects.belongsToMany(this.Users, {through: 'UserProjects', as: 'User'});

    this.db.sync();
}