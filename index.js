const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

let countRequests = 0;

server.use((req,res,next) => {
    console.log(`Number Of Requests  = ${++countRequests}`);
    return next();
});

function checkProjectExists(req, res, next){
    if(!projects[req.params.id]){
        return res.status(400).json({error : 'Project not Found'})
    }
    return next();
}

server.post('/projects', (req,res) => {
    const {id, title} = req.body;
    projects.push({id,title,tasks:[]});
    return res.json(projects);
});

server.get('/projects', (req,res) => {
    return res.json(projects);
});

server.put('/projects/:id',checkProjectExists, (req,res) => {
    const {id} = req.params;
    const {title} = req.body;
    projects[id] = {...projects[id], title}
    return res.json(projects);
});

server.delete('/projects/:id',checkProjectExists, (req,res) => {
    const {id} = req.params;
    projects.splice(id, 1);
    return res.send();
});

server.post('/projects/:id/tasks',checkProjectExists, (req,res) => {
    const {id} = req.params;
    const {title} = req.body;
    var project =  projects[id];
    project.tasks.push(title);
    return res.json(projects);
});

server.listen(3000);
