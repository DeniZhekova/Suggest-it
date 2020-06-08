const Suggest=require('../model/Suggest');
const formidable=require('formidable');
const fs=require('fs');
const _=require('lodash');
const getSuggestions = async (req, res) => {
    // get current page from req.query or use default value of 1
    const currentPage = req.query.page || 1;
    // return 3 suggestions per page
    const perPage = 6;
    let totalItems;
    const suggestions = await Suggest.find()
        // countDocuments() gives you total count of suggestions
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Suggest.find()
                .skip((currentPage - 1) * perPage)
                .populate("comments", "text created")
                .populate("comments.postedBy", "_id name")
                .populate("postedBy", "_id name")
                .sort({ created: -1 })
                .limit(perPage)
                .select("_id title body likes created");
        })
        .then(post => {
            res.status(200).json({post});
        })
        .catch(err => console.log(err));
};

const like = (req, res) => {
    Suggest.findByIdAndUpdate(req.body.suggestId, { $push: { likes: req.body.userId } }, { new: true }).exec(
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        }
    );
};

const unlike = (req, res) => {
    Suggest.findByIdAndUpdate(req.body.suggestId, { $pull: { likes: req.body.userId } }, { new: true }).exec(
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        }
    );
};
const createSuggest=(req,res)=>{
    let form=new formidable.IncomingForm()
    form.keepExtensions=true; // allow to keep extn of file
    form.parse(req,(err,fields,files)=>{ // files fields are like req.body
        if(err) return res.status(400).json({error:"Image could not uploaded"});

        let suggest=new Suggest(fields)
        req.profile.hashed_password=undefined;
        req.profile.salt=undefined;
        suggest.postedBy=req.profile;
        if(files.photo){ // photo is name of filed in frontend
            suggest.photo.data=fs.readFileSync(files.photo.path)
            suggest.photo.contentType=files.photo.type
        }
        suggest.save((err,result)=>{
            if(err) return res.status(400).json({error:err})
            res.json(result);
        })

    });
}
const photo = (req, res) => {
    res.set('Content-Type', req.suggest.photo.contentType);
    return res.send(req.suggest.photo.data);
};

const singleSuggestion = (req, res) => {
    return res.json(req.suggest);
};

const postByUser=(req,res)=>{
    Suggest.find({postedBy: req.profile._id})
    .populate("postedBy","_id name")
    .sort("_created")
    .exec((err,result)=>{
        if(err) return res.status(400).json({error:err})
        res.json({result});
    })
}
const postById=(req,res,next,id)=>{
    Suggest.findById(id)
    .populate("postedBy","_id name role")
    .exec((err,suggest)=>{
        if(err || !suggest){
            return res.status(400).json({
                error:err
            })
        }
        req.post=suggest;
        next();
    })
}

const isPoster=(req,res,next)=>{
    let sameUser=req.suggest && req.auth && req.suggest.postedBy._id==req.auth._id
    let adminUser=req.suggest && req.auth && req.auth.role==="admin";
    console.log('req.suggest',req.suggest,"req.auth: ",req.auth);
    let isPoster=sameUser || adminUser;
    //console.log(req.suggest.postedBy._id==req.auth._id);
    if(!isPoster){
        return res.status(403).json({
            error:"Unauthorized to delete"
        })
    }
    next();
}
const deleteSuggestion=(req,res)=>{
    let suggest=req.suggest;
    suggest.remove((err)=>{
        if(err) return res.status(400).json({error:err})
        res.json({msg:'Deleted Suggestion!'})
    })
}
const updateSuggest=(req,res)=>{
    let suggest=req.suggest;
    suggest= _.extend(suggest,req.body) //mutate the source object
    suggest.updated=Date.now();
    suggest.save((err)=>{
        if(err) return res.status(400).json({error:'You are not authorized to perform this action'});
        res.json(post)
    })
}
const comment = (req, res) => {
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;

    Suggest.findByIdAndUpdate(req.body.suggestId, { $push: { comments: comment } }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};

const uncomment = (req, res) => {
    let comment = req.body.comment;

    Suggest.findByIdAndUpdate(req.body.suggestId, { $pull: { comments: { _id: comment._id } } }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};

const updateComment = (req, res) => {
    let comment = req.body.comment;

    Suggest.findByIdAndUpdate(req.body.suggestId, { $pull: { comments: { _id: comment._id } } }).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        } else {
            Suggest.findByIdAndUpdate(
                req.body.suggestId,
                { $push: { comments: comment, updated: new Date() } },
                { new: true }
            )
                .populate('comments.postedBy', '_id name')
                .populate('postedBy', '_id name')
                .exec((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: err
                        });
                    } else {
                        res.json(result);
                    }
                });
        }
    });
};

module.exports={
    getSuggestions,
    createSuggest,
    postByUser,
    postById,
    isPoster,
    deleteSuggestion,
    updateSuggest,
    singleSuggestion,
    photo,
    like,
    unlike,
    comment,
    uncomment,
    updateComment
}