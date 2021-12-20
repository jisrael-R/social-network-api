const router = require('express').Router();


const {
    getAllUser,
    getUserById,
    createUser,
    updateUser,
    makeFriends,
    deleteUserThought,
    deletedUser,
    deleteFriend
}= require('../../controllers/user-controller');

router
    .route('/')
    .get(getAllUser)
    .post(createUser);

router
 .route('/:userId/friends/:friendsId')
 .post(makeFriends)
 .delete(deleteFriend);


router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deletedUser)
router
  .route('/:userId/:thoughtId')
  .delete(deleteUserThought)
    module.exports = router;