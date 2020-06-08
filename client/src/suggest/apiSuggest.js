import axios from "axios";

export const create= async (userId,token,suggest)=>{
    return await axios.post(`/api/suggest/new/${userId}`,suggest,{ headers: {"Authorization" : `Bearer ${token}`} })
    .then(res=> res.data)
    .catch(err => err);

};

export const list= async ()=>{
    return await axios.get(`/api/suggest`)
    .then(res=> {
        console.log(res);
        return res.data;
    })
    .catch(err => {
        console.log(err)
        return err;
    });
}
export const pageList = async page => {
    return await axios.get(`/api/suggest/?page=${page}`)
    .then(res=>{
        console.log(res);
        return res.data;
    }).catch(err=> {
        console.log(err.response);
        return err.response;
    })
    
};

export const like = (userId, token, suggestId) => {
    return fetch(`/api/suggest/like`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, suggestId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const unlike = (userId, token, suggestId) => {
    return fetch(`/api/suggest/unlike`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, suggestId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};
export const singleSuggestion=async (id)=>{
    return await axios.get(`/api/suggest/${id}`)
    .then(res => res.data)
    .catch(err => err);
};
export const listByUser = async (userId, token) => {
    return await axios
      .get(`/api/suggest/by/${userId}`,{ headers: {"Authorization" : `Bearer ${token}`}})
      .then(res => res.data.result)
      .catch(err => console.error(err));
};
export const remove = async (suggestId, token) => {
    try {
        const response = await fetch(`/api/suggest/${suggestId}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return response.json();
    }
    catch (err) {
        return console.log(err);
    }
};
export const update = async (suggestId, token, suggest) => {
    //console.log(suggestId, token, suggest);
    try {
        const response = await fetch(`/api/suggest/${suggestId}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            },
            body: suggest
        });
        return response.json();
    }
    catch (err) {
        return console.log(err);
    }
};


export const comment = (userId, token, suggestId, comment) => {
    return fetch(`/api/suggest/comment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, suggestId, comment })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const uncomment = (userId, token, suggestId, comment) => {
    return fetch(`/api/suggest/uncomment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, suggestId, comment })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

