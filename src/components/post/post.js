import React,{useState,useEffect} from 'react';
import './post.css';
import Avatar from "@material-ui/core/Avatar";
import {db} from '../../firebase'
import {Input,Button} from '@material-ui/core'

const Post = (props) => {
    const [comments,setComments] = useState([]);
    const [comment,setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if(props.postId) {
            unsubscribe = db.ref(`${props.postId}/comments`)
                        .on('value',(snapshot)=>{  
                            let comments = [];
                            snapshot.forEach(childSnapshot=>{
                                console.log(childSnapshot.key)
                                comments.push(childSnapshot.val())
                                setComments(comments)
                            })
                        })
        }  
        return() =>{
            unsubscribe();
        } 
    },[props.postId])

    const postComment =(e) => {
        e.preventDefault();
        db.ref(`${props.postId}/comments/`).push({
            text:comment,
            username:props.user.displayName
        });
        setComment('');
    }

    return (
        <div className="post">
            {/*Header -> Avatar + username*/}
            <div className="post_header">
                <Avatar 
                    className="post_avatar"
                    alt={props.username}
                    src="/static/images/avatar/1.jpg"
                />
                <h3>{props.username}</h3>
            </div>       
            {/* image */}
            <img className="post__image" src={props.imageUrl} alt=""/>

            {/* Username and caption */}
            <h4 className="post_text"><strong>{props.username}</strong> : {props.caption} </h4>

            <div className="post_comments">
            { comments.map((comment,i)=>{
               return (
                    <p className="post_commentContainer" key={i}>
                        <strong>{comment.username}</strong> {comment.text} 
                    </p>               
               )
               })       
            }
            </div>

            {/* Comments */}
            {props.user ? 
                <div>
                     <form  className="post_commentBox">
                        <Input 
                            className="post_input"
                            type="text"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e)=>setComment(e.target.value)}
                        />
                        <Button
                            className="post_button"
                            disabled={!comment}
                            type="submit"
                            onClick={postComment}
                        >
                            Post
                        </Button>
                    </form>
                </div>
            : null}
        </div>
    );
};

export default Post;