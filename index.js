const { db, Users, Projects, Deadlines, Meetings, Devices, seed } = require("./models");

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

app.post("/getDeadlinesForProject", (req, res) => {
    Deadlines.findAll({
        where: {ProjectId: req.query.projectId}
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send(err);
    })
})

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

app.post("/getMeetingsForProject", (req, res) => {
    Meetings.findAll({
        where: {ProjectId: req.query.projectId}
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send(err);
    })
})


app.get("/updateDB", (req, res) => {1
    seed();
    res.status(200).send(`DB successfully updated!`);
})

app.listen(port, () =>
    console.log(`API now listening at http://localhost:${port}`)
);
