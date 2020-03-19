const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    projects: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }]
}, {timestamps: true});

UserSchema.methods.toJSON = function(){
    return {
        id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        projects: this.projects,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    }
};

UserSchema.pre('remove', function(next){
 this.model('Project').deleteMany({ author: this._id }).exec();
});


mongoose.model('User', UserSchema);