import React, { useState } from "react";
import postContext from "./postContext";
import { useJwt } from "react-jwt";

const HOST = process.env.REACT_APP_HOST;

const PostState =  (props) => {
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(false)
  const { decodedToken, isExpired } = useJwt(
    localStorage.getItem("auth-token")
  );
  const currUser = decodedToken?.user;
  const getTimeline = async () => {
    setPostLoading(true)
    const url = `${HOST}/api/posts/timeline/all/`;
    const data = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
    });

    const json = await data.json();
    if (json.length!==0) {
      setPosts(json);
      setPostLoading(false)
    }
    return json;
  };

  const createPost = async (desc) => {
    const url = `${HOST}/api/posts/`;
    const data = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify({ desc }),
    });

    const json = await data.json();
    setPosts(...posts, json);
    console.log(posts)
    return json;
  };

  const deletePost = async (id) => {
    const url = `${HOST}/api/posts/${id}`;
    const data = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
    });

    const json = await data.json();
    setPosts(posts.filter((f) => f._id === id));
    return json;
  };
  const likePost = async (id) => {
    
    const url = `${HOST}/api/posts/${id}/like`;
    const data = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
    });
    const json = await data.json();
    let newPosts = JSON.parse(JSON.stringify(posts));
    for (let index = 0; index < newPosts.length; index++) {
      const element = newPosts[index];
      if(element._id === id && !element.likes.includes(currUser.id)) 
      { 
        await element.likes.push(currUser.id)
      }else
      {
        if(element._id===id && element.likes.includes(currUser.id)){
          await element.likes.splice(index,currUser.id)
        }
      }
    }
    setPosts(newPosts);
    
    return json;
  };
  return (
    <postContext.Provider
      value={{ getTimeline, deletePost, createPost, likePost, posts, setPosts, postLoading }}
    >
      {props.children}
    </postContext.Provider>
  );
};

export default PostState;
