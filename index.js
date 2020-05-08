const { db, Users, Projects, Deadlines, Meetings, Devices, UserProjects, seed } = require("./models");

const express = require("express");
const app = express();
const port = 6969;

app.get("/", (req, res) => {
    res.send(
        `This is the API for the Open Innovation Lab Project Management System`
    );
});

app.post("/login", (req, res) => {
    if(Object.keys(req.query).length === 0){
        res.sendStatus(400);
        return;
    }
    Users.findOne({
        where: {
            email: req.query.username,
            password: req.query.password,
        },
    }).then(result => {
        if (result == null) {
            res.sendStatus(400);
        } else {
            res.json({
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
            });
        }
    });
});

app.post("/register", (req, res) => {
    Users.create({
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        email: req.query.email,
        password: req.query.password,
    })
        .then(result => {
            res.status(200).send(`Successfully Registered User`);
        })
        .catch(err => {
            console.log(err);
            res.status(418).send(
                `An account with that user already exists: ${err}`
            );
        });
});

app.post("/createProject", (req, res) => {
    Projects.create({
        name: req.query.name,
        description: req.query.desc,
        budget: req.query.budget
    }).then(result => {
        res.status(200).send(`Successfully created Project ${result.id}: ${result.name}`);
    }).catch(err => {
        res.status(500).send(err);
    })
});

app.post("/addDeadline", (req, res) => {
    Deadlines.create({
        date: req.query.date,
        name: req.query.name,
        description: req.query.desc,
        ProjectId: req.query.project
    }).then((result) => {
        res.status(200).send(`Successfully created Deadline ${result.name} for Project: ${result.ProjectId}`);
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.post("/removeDeadline", (req, res) => {
    Deadlines.destroy({
        where: {
            id: req.query.id
        }
    }).then(result => {
        if(result == 0) {
            res.status(400).send(`Deadline ID ${req.query.id} does not exist`)
        } else {
            res.status(200).send(`Successfully deleted Deadline: ${req.query.id}`);
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.get("/getDeadlinesForProject", (req, res) => {
    Deadlines.findAll({
        where: {ProjectId: req.query.projectId}
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send(err);
    })
});

app.post("/addMeeting", (req, res) => {
    Meetings.create({
        date: req.query.date,
        name: req.query.name,
        description: req.query.desc,
        ProjectId: req.query.project
    }).then(result => {
        res.status(200).send(`Successfully created Meeting ${result.name} for Project: ${result.ProjectId}`);
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.post("/removeMeeting", (req, res) => {
    Meetings.destroy({
        where: {
            id: req.query.id
        }
    }).then(result => {
        if(result == 0) {
            res.status(400).send(`Meeting ID ${req.query.id} does not exist`)
        } else {
            res.status(200).send(`Successfully deleted Meeting: ${req.query.id}`);
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.get("/getMeetingsForProject", (req, res) => {
    Meetings.findAll({
        where: {ProjectId: req.query.projectId}
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send(err);
    })
});

app.get("/userProjects", (req, res) => {
    Users.findAll({
        where: {email: req.query.email},
        attributes: ['email'],
        include: [{
            model: Projects,
            as: 'Project',
        }]
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send(err);
    })
});

app.get("getProjectDevices", (req, res) => {
    Devices.findAll({
        where: {
            ProjectId: req.query.projectId
        }
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send(err);
    })
});

app.post("/assignUserProject", (req, res) => {
    UserProjects.create({
        UserEmail: req.query.email,
        ProjectId: req.query.projectId
    }).then(result => {
        res.status(200).send(`Assigned user ${req.query.email} to project ${req.query.projectId}`);
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.get("/updateDB", (req, res) => {
    seed();
    res.status(200).send(`DB successfully updated!`);
});



app.listen(port, () => {
    seed();
    console.log(`API now listening at http://localhost:${port}`);
});
