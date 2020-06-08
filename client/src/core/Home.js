import React from 'react'
import SuggestionsList from '../suggest/SuggestionsList';
function Home() {
    return (
        <div className='mb-5'>
            <div className="jumbotron">
                <h2>Home</h2>
                <p className='lead'>Welcome To Suggest-It. You can post, edit, delete,like and sign suggestions </p>
            </div>
            <div className='container-fluid'>
                    <SuggestionsList />
            </div>
        </div>
    )
}

export default Home;
