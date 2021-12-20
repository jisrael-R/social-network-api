
const {User, Thought} =  require('../models');


const userController = {
    getAllUser(req, res){
        User.find({})
       
        .select('-__v')
        .sort({_id:-1})
        .then(dbUserData => res.json(dbUserData))
        .catch(err =>{
            console.log(err);
            res.status(400);
        });
    },

    getUserById({params}, res){
        User.findOne(
            {_id: params.id}
            )
        .populate({
            path:'friends',
            select:'-__v'
        })
        .populate({
            path: 'thoughts'
        })
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err =>{
            console.log(err);
            res.status(400);
        });
    },

    createUser({body}, res){
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    },
    makeFriends({params}, res){
        User.findByIdAndUpdate(
            {_id:params.userId},
            {$addToSet:{friends:params.friendsId}},
            { new: true })
       
        .then(dbUserData =>{
            if (!dbUserData){
                res.status(404).json({message: 'No User Found with this Id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err =>res.json(err));
        
     },
     deleteFriend({params}, res){
         User.findByIdAndUpdate(
             {_id:params.userId},
             {$pull:{friends:params.friendsId}},
             {new:true}
         )
         .then(dbUserData =>res.json(dbUserData))
         .catch(err =>res.json(err));
     },
    updateUser({params,body}, res){
        User.findByIdAndUpdate( {_id: params.id}, body,{new: true, runValidators: true})
        .then(dbUserData =>{
            if (!dbUserData){
                res.sendStatus(404).json({ message:'No User Found With This Id.'})
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.Status(400).json(err));
    },

    deleteUserThought({ params}, res){
        User.findByIdAndDelete(
            {_id:params.userId}
        ).then(deletedUser =>{
            if(!deletedUser){
                return res.status(404).json({message:'No User found With This Id'});

            }
            return Thought.findByIdAndDelete(
                {_id:params.thoughtId}
                
            );
        })
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({ message:'No Thought Found'});
                return;
            }
            res.json(dbUserData);
        })
       .catch(err => res.json(err));   
    },

    deletedUser({params}, res){
       User.findOneAndDelete(
        {_id:params.id})
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({message:'Now User Found'});
                return;
            }
            Thought.deleteMany(
                  {username: dbUserData.username } ,
                { userId:dbUserData.userId }
            )
        }).then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
        
    }

   
};

module.exports = userController;