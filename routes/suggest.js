import {singleSuggestion} from "../client/src/suggest/apiSuggest";

const {getSuggestions,createSuggest,photo,like,
    unlike,singleSuggestion,updateSuggest,postByUser,postById,isPoster,
    deleteSuggestion,comment,
    uncomment,
    updateComment}=require('../controllers/suggest');
const express = require("express");
const router = express.Router();
const validator=require('../helpers');
const {requireSignin}=require('../controllers/auth');
const {userById}=require('../controllers/user');

router.get("/suggestions",getSuggestions());
// like unlike
router.put('/suggest/like', requireSignin, like);
router.put('/suggest/unlike', requireSignin, unlike);
// comments

router.put('/suggest/comment', requireSignin, comment);
router.put('/suggest/uncomment', requireSignin, uncomment);
router.put('/suggest/updatecomment', requireSignin, updateComment);

router.get("/suggest/by/:userId",postByUser);
router.put('/suggest/:postId',requireSignin,isPoster,updateSuggest());
router.post('/suggest/new/:userId',requireSignin,validator.createPostValidator,createSuggest());
router.delete("/suggest/:postId",requireSignin,isPoster,deleteSuggestion)
router.get('/suggest/photo/:postId', photo);
router.get('/suggest/:postId', singleSuggestion);


router.param("userId",userById);
router.param("postId",postById);

module.exports=router;