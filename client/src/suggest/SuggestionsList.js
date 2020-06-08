import React, { Component } from "react"; 
import {list,pageList} from './apiSuggest';
import {Link} from 'react-router-dom';
import Logo from '../core/Logo.png';
class SuggestionsList extends Component {
    constructor(){
        super();
        this.state={
            suggestions:[],
            page: 1,
            loading:false
        }
    }
    componentDidMount(){
        this.setState({loading:true})
        this.loadSuggestions(this.state.page);
        list().then(data =>{
            //console.log(data)
            this.setState({suggestions:data.suggest,loading:false})
        }).catch(err => console.log(err.response))
    }
    loadMore = number => {
        this.setState({ page: this.state.page + number });
        this.loadSuggestions(this.state.page + number);
    };

    loadLess = number => {
        this.setState({ page: this.state.page - number });
        this.loadSuggestions(this.state.page - number);
    };

    loadSuggestions = page => {
        pageList(page).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                console.log(data.post);
                this.setState({ suggestions: data.post });
            }
        });
    };

    renderSuggestions = suggestions => {
        return (
            <div className="row">
                {suggestions.map((suggest, i) => {
                    const posterId = suggest.postedBy
                        ? `/user/${suggest.postedBy._id}`
                        : "";
                    const posterName = suggest.postedBy
                        ? suggest.postedBy.name
                        : " Unknown";

                    return (
                        <div className="card col-md-4" key={i}>
                            <div className="card-body">
                                <img
                                    src={`/api/suggest/photo/${suggest._id}`}
                                    alt={suggest.title}
                                    onError={i =>
                                        (i.target.src = `${Logo}`)
                                    }
                                    className="img-fluid mb-3"
                                    style={{ height: "200px", width: "100%",backgroundColor:'#0E2F56' }}
                                />
                                <h5 className="card-title">{suggest.title}</h5>
                                <p className="card-text" dangerouslySetInnerHTML={{ __html: post.body.substring(0, 200)+'...'}}>
                                </p>
                                
                                <br />
                                <p className="font-italic mark">
                                    Posted by{" "}
                                    <Link to={`${posterId}`}>
                                        {posterName}{" "}
                                    </Link>
                                    on {new Date(suggest.created).toDateString()}
                                </p>
                                <Link
                                    to={`/suggest/${suggest._id}`}
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
      const {suggestions,loading,page}=this.state;
      if(loading){
          return <h2>Loading...</h2>
  }
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">
          {!suggestions.length ? "No more suggestions!" : "Recent Suggestions"}
        </h2>

        {this.renderSuggestions(suggestions)}
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

                {suggestions.length ? (
                    <button
                        className="btn btn-raised btn-success mt-5 mb-5"
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

export default SuggestionsList;