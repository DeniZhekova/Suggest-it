import React, { Component } from 'react'
import {singleSuggestion,remove,like, unlike } from './apiSuggest';
import {Link,Redirect} from 'react-router-dom';
import { isAuthenticated } from '../auth';
import Comment from './Comment';
import Share from './Share';
import Logo from '../core/Logo.png';
class SingleSuggestion extends Component {
    state={
        suggest:'',
        redirectToHome: false,
        redirectToSignin: false,
        like: false,
        likes: 0,
        comments: []
    }
    checkLike = likes => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;
        return match;
    };
    componentDidMount=()=>{
        const suggestId=this.props.match.params.suggestId
        singleSuggestion(suggestId).then(data =>{
            this.setState({suggest:data,likes: data.likes.length,comments: data.comments,like:this.checkLike(data.likes)})
        }).catch(err => console.log(err))
    }
    updateComments = comments => {
        this.setState({ comments });
    };

    likeToggle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true });
            return false;
        }
        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated().user._id;
        const suggestId = this.state.suggest._id;
        const token = isAuthenticated().token;

        callApi(userId, token, suggestId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length
                });
            }
        });
    };
    deleteSuggestion = () => {
        const suggestId = this.props.match.params.suggestId;
        const token = isAuthenticated().token;
        remove(suggestId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ redirectToHome: true });
            }
        });
    };

    deleteConfirmed = () => {
        let answer = window.confirm('Are you sure you want to delete your suggestion?');
        if (answer) {
            this.deleteSuggestion();
        }
    };
    renderSuggest = suggest => {
        const posterId = suggest.postedBy ? `/user/${suggest.postedBy._id}` : '';
        const posterName = suggest.postedBy ? suggest.postedBy.name : ' Unknown';
        const { like, likes } = this.state;
        return (
            <div className="card-body mb-5">
                <Link to={`/`} className="btn btn-raised btn-link btn-md">
                        Back to suggestions
                    </Link>
                <h2>{suggest.title}</h2>
                <img
                    src={`/api/suggest/photo/${suggest._id}`}
                    alt={suggest.title}
                    onError={i => (i.target.src = `${Logo}`)}
                    className="img-fluid mb-3"
                    style={{
                        height: '300px',
                        width: '100%',
                        objectFit: 'cover',
                        backgroundColor:'#0E2F56' 
                    }}
                />
                {like ? (
                    <h3 onClick={this.likeToggle}>
                        <i
                            className="thumbs up outline icon text-success"
                            style={{ padding: '10px', borderRadius: '50%' }}
                        />{' '}
                        {likes} Like
                    </h3>
                ) : (
                    <h3 onClick={this.likeToggle}>
                        <i
                            className="thumbs up outline icon text-warning"
                            style={{ padding: '10px', borderRadius: '50%' }}
                        />{' '}
                        {likes} Like
                    </h3>
                )}
                <Share title={suggest.title}/>
                <hr />
                <div className='container' dangerouslySetInnerHTML={{ __html: suggest.body}}></div>
                <br />
                <p className="font-italic mark">
                    Posted by <Link to={`${posterId}`}>{posterName} </Link>
                    on {new Date(suggest.created).toDateString()}
                </p>
                {isAuthenticated().user && isAuthenticated().user._id === suggest.postedBy._id && (
                        <div>
                            <Link to={`/suggest/edit/${suggest._id}`} className="btn btn-raised btn-info btn-md">
                                Update Suggestion
                            </Link>
                            <button onClick={this.deleteConfirmed} className="btn btn-raised btn-md btn-danger">
                                Delete Suggestion
                            </button>
                        </div>
                    )}
                    <div>
                    {isAuthenticated().user &&
                        isAuthenticated().user.role === "admin" && (
                            <div className="card mt-5">
                                <div className="card-body">
                                    <h5 className="card-title">Admin</h5>
                                    <p className="mb-2 text-danger">
                                        Edit/Delete as an Admin
                                    </p>
                                    <Link
                                        to={`/suggest/edit/${suggest._id}`}
                                        className="btn btn-raised btn-warning btn-sm mr-5"
                                    >
                                        Update Suggestion
                                    </Link>
                                    <button
                                        onClick={this.deleteConfirmed}
                                        className="btn btn-raised btn-danger"
                                    >
                                        Delete Suggestion
                                    </button>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        );
    };
    render() {
        const { suggest,redirectToHome,redirectToSignin,comments} = this.state;
        if (redirectToHome) {
            return <Redirect to={`/`} />;
        } else if (redirectToSignin) {
            return <Redirect to={`/login`} />;
        }
        return (
            <div className='container mt-5 mb-5'>
            {!suggest ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    this.renderSuggest(suggest)
                )}
                <Comment suggestId={suggest._id} comments={comments.reverse()} updateComments={this.updateComments} />
            </div>
        )
    }
}

export default SingleSuggestion
