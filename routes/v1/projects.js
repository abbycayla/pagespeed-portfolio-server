const router = require('express').Router();
const _ = require('lodash');
const mongoose = require('mongoose');

const Project = mongoose.model('Project');
const User = mongoose.model('User');

router.param('project', function(req, res, next, id){
    Project.findById(id)
    .then(function(project){
        if(!aroject){
            return res.sendStatus(404);
        }
        req.project = project;
        return next();
    });
});

/**
 * Get all Projects
 */
router.get('/', function(req, res, next){
    console.log('get projects');
    Project
    .find()
    .populate('author')
    .sort({createdAt: 'desc'})
    .then(function(projects){
            return res.json({
            Projects: projects.map(function(project){
                return project.toJSON();
            })
        });
    });
    
});

/**
 * Get an Project by ID.
 */
router.get('/:project', function(req, res, next){
    console.log('get Project by id');
    return res.json({ project: req.project.toJSON() });
});

// /**
//  * Create an Project.
//  */
// router.post('/', async function(req, res, next){
//     let email = req.body.email;
//     let user = await User.findOne({ email: email });
//     if(!user){
//         return res.status(422).json({
//             success: false, message: 'User does not exist'
//         });
//     }
//     let Project = new Project(req.body);
//     Project.author = user;
//     await Project.save();
//     user.Projects.push(Project);
//     await user.save();
//     return res.json({ Project: Project.toJSON() });
// });

/**
 * Update an Project.
 */
router.put('/:project', async function(req, res, next){
    console.log('update Project-->', req.body);
    let updatedProject = _.extend(req.project, req.body);
    await updatedProject.save();
    return res.json({ project: updatedProject.toJSON() });
});

/**
 * Delete an Project.
 */
router.delete('/:project', async function(req, res, next){
    console.log('delete Project');
    await Project.findByIdAndRemove(req.project.id);
    return res.sendStatus(204);
});

module.exports = router;