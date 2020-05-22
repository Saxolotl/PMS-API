const { db, Users, Projects, Deadlines, Meetings, Devices, UserProjects, Invoices, seed } = require("./models");

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");

var upload = multer({ dest: 'invoices/'});

const cors = require("cors");

const app = express();
const port = 6969;

app.use(cors(corsOptions));
app.use(bodyParser.json());


var corsOptions = {
    origin: 'http://localhost:3000'
}


app.get("/", (req, res) => {
    res.send(
        `This is the API for the Open Innovation Lab Project Management System`
    );
});

app.post("/login", (req, res) => {
    if(Object.keys(req.body).length === 0){
        res.sendStatus(400);
        return;
    }
    Users.findOne({
        where: {
            email: req.body.email,
            password: req.body.password,
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
    if(Object.keys(req.body).length !== 4) {
        res.status(400).send(`ServerError: Incorrect number of arguments`);
    } else {
        Deadlines.create({
            date: req.body.date,
            name: req.body.title,
            description: req.body.description,
            ProjectId: req.body.projectId
        }).then(result => {
            Deadlines.findOne({
                where: {
                    id: result.id
                },
                include: [{
                    model: Projects
                }]
            }).then(result => {
                res.status(200).send({
                    message: `Successfully Created ${result.name} for ${result.Project.name}`,
                    error: false,
                    deadlineId: result.id
                });
            });
        }).catch(err => {
            res.status(500).send(err);
            console.error(err);
        });
    }
});

app.post("/editDeadline", (req, res) => {
    Deadlines.update({
        date: req.body.date,
        name: req.body.title,
        description: req.body.description,
    }, {
        where: {
            id: req.body.id
        }
    }).then(result => {
        if(result == 0) {
            res.status(500).send({
                message: `Could not update meeting`,
                error: true,
                deadlineId: result.id
            });
        } else {
            res.status(200).send({
                message: `Successfully updated ${req.body.title}`,
                error: false,
                deadlineId: result.id
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message,
            error: true,
            deadlineId: req.body.id
        });
    });
})

app.get("/removeDeadline", (req, res) => {
    Deadlines.destroy({
        where: {
            id: req.query.id
        }
    }).then(result => {
        console.log(result);
        if(result == 0) {
            res.status(400).send({
                message: `Unable to Delete`,
                error: true
            })
        } else {
            res.status(200).send({
                message: `Successfully Deleted`,
                error: false
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message,
            error: true,
        });
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
    if(Object.keys(req.body).length !== 4) {
        res.status(400).send(`ServerError: Incorrect number of arguments`);
    } else {
        Meetings.create({
            date: req.body.date,
            name: req.body.title,
            description: req.body.description,
            ProjectId: req.body.projectId
        }).then(result => {
            Meetings.findOne({
                where: {
                    id: result.id
                },
                include: [{
                    model: Projects
                }]
            }).then(result => {
                res.status(200).send({
                    message: `Successfully Created ${result.name} for ${result.Project.name}`,
                    error: false,
                    meetingId: result.id
                });
            });
        }).catch(err => {
            res.status(500).send(err);
            console.error(err);
        });
    }
});

app.get("/removeMeeting", (req, res) => {
    Meetings.destroy({
        where: {
            id: req.query.id
        }
    }).then(result => {
        console.log(result);
        if(result == 0) {
            res.status(400).send({
                message: `Unable to Delete`,
                error: true
            })
        } else {
            res.status(200).send({
                message: `Successfully Deleted`,
                error: false
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message,
            error: true,
        });
    });
});

app.post("/editMeeting", (req, res) => {
    Meetings.update({
        date: req.body.date,
        name: req.body.title,
        description: req.body.description,
    }, {
        where: {
            id: req.body.id
        }
    }).then(result => {
        if(result == 0) {
            res.status(500).send({
                message: `Could not update meeting`,
                error: true,
                meetingId: result.id
            });
        } else {
            res.status(200).send({
                message: `Successfully updated ${req.body.title}`,
                error: false,
                meetingId: result.id
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message,
            error: true,
            meetingId: req.body.id
        });
    });
})

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

app.get("/getProject", (req, res) => {
    Projects.findOne({
        where: {id: req.query.id}
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send(err);
    })
})

app.get("/getUserDeadlines", (req, res) => {
    Deadlines.findAll({
        include: [{
            model: Projects,
            include: [{
                model: Users,
                as: 'User',
                where: {email: req.query.email},
                attributes: [],
            }],
            required: true
        }]
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send(err);
    })
});

app.get("/getUserMeetings", (req, res) => {
    Meetings.findAll({
        include: [{
            model: Projects,
            include: [{
                model: Users,
                as: 'User',
                where: {email: req.query.email},
                attributes: [],
            }],
            required: true
        }]
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send(err);
    })
});

app.get("/getProjectDevices", (req, res) => {
    Devices.findAll({
        where: {
            ProjectId: req.query.projectId
        }
    }).then(result => {
        if(result.length == 0){
            res.status(404).send(`No Devices were found for this project`);
        } else{
            res.status(200).send(result);
        }
    }).catch(err => {
        res.status(500).send(err);
    })
});

app.post("/assignDeviceProject", (req, res) => {
    Devices.update(
        {ProjectId: req.query.projectId},
        {
            where: {assetId: req.query.assetId}
        }
    ).then(result => {
        if(result[0] === 0){
            res.status(400).send(`That device doesn't exist!`);
        } else{
            res.status(200).send(`Device ${req.query.assetId} has been assigned to Project ${req.query.projectId}`);
        }
    }).catch(err => {
        res.status(500).send(err);
    })
});

app.post("/deassignDeviceProject", (req, res) => {
    Devices.update(
        {ProjectId: null},
        {
            where: {assetId: req.query.assetId}
        }
    ).then(result => {
        if(result[0] === 0){
            res.status(400).send(`That device doesn't exist!`);
        } else{
            res.status(200).send(`Device ${req.query.assetId} has been deassigned`);
        }
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

app.get("/getProjectUsers", (req, res) => {
    Projects.findOne({
        where: {
            id: req.query.projectId
        },
        attributes: [],
        include: [{
            model: Users,
            as: "User"
        }]
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send(err);
    })
})

app.post("/createDevice", (req, res) => {
    Devices.create({
        serialNumber: req.query.serialNo,
        deviceType: req.query.type,
        description: req.query.desc,
    }).then(result => {
        res.status(200).send(`Created Device ${result.assetId} with serial no. ${result.serialNumber}`);
    }).catch(err => {
        res.status(500).send(err);
    })
});

app.post("/deleteDevice", (req, res) => {
    Devices.destroy({
        where: {
            assetId: req.query.assetId
        }
    }).then(result => {
        if(result == 0) {
            res.status(400).send(`Device ID ${req.query.assetId} does not exist`)
        } else {
            res.status(200).send(`Successfully deleted Device: ${req.query.assetId}`);
        }
    }).catch(err => {
        res.status(500).send(err);
    })
});

app.get("/getDevices", (req, res) => {
    Devices.findAll().then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send(err);
    })
});

app.get("/getDeviceById", (req, res) => {
    Devices.findAll({
        where: {
            assetId: req.query.assetId
        }
    }).then(result => {
        if(result.length == 0){
            res.status(404).send(`No Devices Found`);
        } else {
            res.status(200).send(result);
        }
    }).catch(err => {
        res.status(500).send(err);
    })
});

app.get("/getDeviceBySerial", (req, res) => {
    Devices.findAll({
        where: {
            serialNumber: req.query.serialNo
        }
    }).then(result => {
        if(result.length == 0){
            res.status(404).send(`No Devices Found`);
        } else {
            res.status(200).send(result);
        }
    }).catch(err => {
        res.status(500).send(err);
    })
});

app.get("/getInvoicesForProject", (req, res) => {
    Invoices.findAll({
        where: {
            ProjectId: req.query.projectId
        }
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send(err);
    })
})

app.post("/addInvoice", upload.single('invoice'), (req, res) => {
    console.log(req.file);
    console.log(req.file.path);

    Invoices.create({
        name: req.body.title,
        cost: req.body.cost,
        date: req.body.date,
        origFileName: req.file.originalname,
        storedFileName: req.file.filename,
        ProjectId: req.body.projectId
    }).then(result => {
        Invoices.findOne({
            where: {
                id: result.id
            },
            include: [{
                model: Projects
            }]
        }).then(result => {
            res.status(200).send({
                message: `Successfully Uploaded ${result.origFileName} for ${result.Project.name}`,
                error: false,
                invoiceId: result.id,
                storedFileName: result.storedFileName
            });
        });
    }).catch(err => {
        res.status(500).send(err);
        console.error(err);
    });
});

app.get("/getInvoiceFile/:id", (req, res) => {
    Invoices.findOne({
        where: {
            id: req.params.id
        }
    }).then(result => {
        res.download(`invoices\\${result.storedFileName}`, result.origFileName);
    })
})

app.get("/updateDB", (req, res) => {
    seed();
    res.status(200).send(`DB successfully updated!`);
});



app.listen(port, () => {
    seed();
    console.log(`API now listening at http://localhost:${port}`);
});
