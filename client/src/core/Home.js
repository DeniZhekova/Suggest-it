import React from 'react'
import Allpost from '../post/Allpost';
function Home() {
    return (
        <div className='mb-5'>
            <div className="jumbotron">
                <h2 className="hometitle">Home</h2>
                <p className='welcome'>Welcome To Suggest-It. You can post, edit, delete,add suggestions and sign a suggestion. </p>
            </div>
            <div className='container-fluid'>
                    <Allpost />
            </div>
        </div>
    )
}

export default Home;
