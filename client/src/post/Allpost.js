import React, { Component } from "react";
import {list,pageList} from './apiPost';
import {Link} from 'react-router-dom';
import Logo from '../core/Logo.png';
import {isAuthenticated} from "../auth";
class Allpost extends Component {
    constructor(){
        super();
        this.state={
            posts:[],
            page: 1,
            loading:false
        }
    }
    componentDidMount(){
        this.setState({loading:true})
        this.loadPosts(this.state.page);
        list().then(data =>{
            const posts = data.post.sort((a, b) => (a.likes.length < b.likes.length) ? 1 : ((b.likes.length < a.likes.length) ? -1 : 0));
            console.log(posts);
           /*posts.forEach( post => {
                if(auth.role === "user" && post.show === false) {
                    posts.pop();
                }
            })*/
            this.setState({posts:posts,loading:false})
        }).catch(err => console.log(err.response))
    }
    loadMore = number => {
        this.setState({ page: this.state.page + number });
        this.loadPosts(this.state.page + number);
    };

    loadLess = number => {
        this.setState({ page: this.state.page - number });
        this.loadPosts(this.state.page - number);
    };

    loadPosts = page => {
        pageList(page).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                const posts = data.post.sort((a, b) => (a.likes.length < b.likes.length) ? 1 : ((b.likes.length < a.likes.length) ? -1 : 0));
                this.setState({ posts: posts });
            }
        });
    };


    renderPosts = posts => {
        return (
            <div className="row">
                {posts.map((post, i) => {
                    const posterId = post.postedBy
                        ? `/user/${post.postedBy._id}`
                        : "";
                    const posterName = post.postedBy
                        ? post.postedBy.name
                        : " Unknown";

                    return (
                        <div className="card col-mt-4 col-md-3" key={i}>
                            <div className="card-body">
                                <img
                                    src={`/api/post/photo/${post._id}`}
                                    alt={post.title}
                                    onError={i =>
                                        (i.target.src = `${Logo}`)
                                    }
                                    className="img-fluid mb-3"
                                    style={{ height: "200px", width: "100%",backgroundColor:'#0E2F56' }}
                                />
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text" dangerouslySetInnerHTML={{ __html: post.body.substring(0, 200)+'...'}}>
                                </p>

                                <br />
                                <p className="font-italic mark">
                                    Posted by{" "}
                                    <Link to={`${posterId}`}>
                                        {posterName}{" "}
                                    </Link>
                                    on {new Date(post.created).toDateString()}
                                </p>
                                <Link
                                    to={`/post/${post._id}`}
                                    className="btn btn-raised btn-primary btn-sm"
                                >
                                    Read more
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };
    render() {
        const {posts,loading,page}=this.state;
        if(loading){
            return <h2>Loading...</h2>
        }
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">
                    {!posts.length ? "No more suggestions!" : "Most signed suggestions"}
                </h2>

                {this.renderPosts(posts)}
                {page > 1 ? (
                    <button
                        className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
                        onClick={() => this.loadLess(1)}
                    >
                        Previous ({this.state.page - 1})
                    </button>
                ) : (
                    ""
                )}

                {posts.length ? (
                    <button
                        className="btn btn-raised btn-primary mt-5 mb-5"
                        onClick={() => this.loadMore(1)}
                    >
                        Next ({page + 1})
                    </button>
                ) : (
                    ""
                )}
            </div>
        );
    }
}

export default Allpost;