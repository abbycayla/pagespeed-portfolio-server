const router = require('express').Router();
const _ = require('lodash');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const Project = mongoose.model('Project');

router.param('user', function(req, res, next, id){
    User.findById(id)
    .then(function(user){
        if(!user){
            return res.sendStatus(404);
        }
        req.user = user;
        return next();
    });
});

/**
 * Get all users
 */
router.get('/', function(req, res, next){
    console.log('get users');
    User
    .find()
    .sort({createdAt: 'desc'})
    .then(function(users){
        return res.json({
            users: users.map(function(user){
                return user.toJSON();
            })
        });
    });
    
});

/**
 * Get an user by ID.
 */
router.get('/:user', async function(req, res, next){
    console.log('get user by id');
    //dynamically populate
    await req.user.populate('projects').execPopulate();
    return res.json({ user: req.user.toJSON() });
});

/**
 * Create a user.
 */
router.post('/', async function(req, res, next){
    console.log('create user----->', req.body);
    let user = new User(req.body);
    await user.save();
    return res.json({ user: user.toJSON() });
});

/**
 * Update an user.
 */
router.put('/:user', async function(req, res, next){
    console.log('update user-->', req.body);
    let updateduser = _.extend(req.user, req.body);
    await updateduser.save();
    return res.json({ user: updateduser.toJSON() });
});

/**
 * Delete an user.
 */
router.delete('/:user', async function(req, res, next){
    console.log('delete user');
    await User.findByIdAndRemove(req.user.id);
    return res.sendStatus(204);
});

/************
 * Entity relationships
 ***********/

/**
 * Get a user's articles
 * GET /v1/users/:user/articles
 */
router.get('/:user/projects', async function(req, res, next){
    let projects = await Project.find({ author: req.user });
    return res.json({
        projects: projects.map(function(project){
            return project.toJSON();
        })
    });
}); 

/**
 * Create an article for a user.
 * POST /v1/users/:user/articles
 */
router.post('/:user/projects', async function(req, res, next){
    if(!req.user){
        return res.status(422).json({
            success: false, message: 'User does not exist'
        });
    }
    let project = new Project(req.body);
    project.author = req.user;
    await project.save();
    req.user.projects.push(project);
    await req.user.save();
    return res.json({ project: project.toSimpleJSON() });
});



/************
 * Auth
 ***********/

/**
 * Log In
 * POST /v1/users/login
 */

router.post('/login', async function(req, res, next) {
    if(!req.body.email) {
        return res.status(422).json({
            success: false, 
            message: 'Email cannot be blank'
        })
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(422).json({
            success: false, 
            message: 'User does not exist'
        })
    }
    return res.json({ user: user.toJSON() });

   
})
     


/**
 * Register a new user
 * POST /v1/users/register
 */

 router.post('/register', async function(req, res, next){
     if (!req.body.email){
        return res.status(422).json({
            success: false, 
            message: 'Email cannot be blank'
        })
     }
     if (!req.body.firstName){
        return res.status(422).json({
            success: false, 
            message: 'First name cannot be blank'
        })
     }
     if (!req.body.lastName){
        return res.status(422).json({
            success: false, 
            message: 'Last name cannot be blank'
        })
     }
     
    let existingUser = await User.findOne({email: req.body.email})
    if(existingUser){
        return res.status(422).json({
            success: false, 
            message: 'User already exists'
        })
    }
    let user = new User(req.body);
    
        await user.save();
        return res.json({ user: user.toJSON() });

   
 })





module.exports = router;