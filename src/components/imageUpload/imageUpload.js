import React,{useState} from 'react';
import {Button,Input} from '@material-ui/core'
import {db,storage} from '../../firebase'
import './imageupload.css'

let date = new Date();

const ImageUpload = ({username}) => {
    const [caption,setCaption] = useState('');
    const [image,setImage] = useState(null);
    // const [url,setUrl] = useState("");
    const [progress,setProgress] = useState(0);

    const handleChange = (e) => {
        if(e.target.files[0]){         // get the first file selected if multiple are selected.
            setImage(e.target.files[0])  
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Progress function ---->
                const progress = Math.round(
                   (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress)
            },
            (error) => {
                console.log(error.message)
            },
            () => {
                // Complete function
                storage.ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    // post image in the db 
                    db.ref().push({
                        timestamp:date,
                        caption:caption,
                        imageUrl:url,
                        username:username
                    });

                    setProgress(0);  // Set progress to zero after Uploading 
                    setCaption("");  // Set Caption to zero after Uploading
                    setImage(null);  //Set image to zero after uploading 
                })
            }
        )
    }
    

    return (
        <div className="image_upload">
            {/* Caption Input */}
            {/* File Picker */}
            {/* Post button */}
            <progress className="imageupload_progress" value={progress} max="100" /> <br/>
            <Input type="text" placeholder="Enter a caption..." onChange={e=>setCaption(e.target.value)} value={caption}/>
            <Input type="file"  onChange={handleChange}/><br/>
            <Button
                onClick={handleUpload}
            >    
            Upload
            </Button>
        </div>
    );
};

export default ImageUpload;