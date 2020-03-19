const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    body: String,
    website: String,
    //create reference to the author
    author: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

ProjectSchema.methods.toJSON = function(){
    let project = {
        id: this.id,
        title: this.title,
        body: this.body,
        website: this.website,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        //  author: this.author.toJSON()
    };

    if(this.author){
        project.author = this.author.toJSON();
    }
    
    return project;
    // return {
    //     id: this.id,
    //     title: this.title,
    //     body: this.body,
    //     createdAt: this.createdAt,
    //     updatedAt: this.updatedAt,
    //      author: this.author.toJSON()
    // }
};

mongoose.model('Project', ProjectSchema);