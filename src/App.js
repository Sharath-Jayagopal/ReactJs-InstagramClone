import React,{ useState , useEffect } from 'react'
import './App.css';
import Post from './components/post/post'
import {db,auth} from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button , Input} from '@material-ui/core';
import ImageUpload from './components/imageUpload/imageUpload'
import InstagramEmbed from 'react-instagram-embed'


function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open,setOpen] = useState(false)
  const [modalStyle] = React.useState(getModalStyle);
  const [openSignIn , setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user,setUser] = useState(null);
  
  const signUp = (e) => {
    e.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((err)=>{alert(err.message)})

    setOpen(false)
  }

  const signIn = (e)=>{
    e.preventDefault();

    auth.signInWithEmailAndPassword(email,password)
    .catch((err)=>alert(err.message))

    setOpenSignIn(false);
  }

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser) {
        // Login
        console.log(authUser);
        setUser(authUser)
      } 
      else {
        // Logout 
        setUser(null)
      }     
    })
    return () => {
      // perform cleanup action
      unsubscribe();
    }
  },[user, username])

  // Runs a specific code based on a special condition
  useEffect(()=>{
    db.ref().orderByChild('timestamp').once('value')
    .then(snapshot=>{
        const userPost = [];
        snapshot.forEach((childSnapshot)=>{
          // console.log(childSnapshot)
          userPost.push({
            id:childSnapshot.key,
            post:childSnapshot.val()
          });
        })
      setPosts(userPost);
    })    
  })
   
  return (
    <div className="App">
      {/* SignUp modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
      <form className="app_signup">
        <center>
          <img 
              className = "app_headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
            /><br />
          <Input  
              placeholder="username"
              type="text"
              value={username}
              onChange = {(e) => setUsername(e.target.value)}
            /> <br />
          <Input  
              placeholder="email"
              type="text"
              value={email}
              onChange = {(e) => setEmail(e.target.value)}
            /><br />
          <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange = {(e) => setPassword(e.target.value)}
            /><br />
          <Button type="submit" onClick={signUp}>Sign Up</Button>
        </center>
      </form>
       
      </div>
      </Modal>

      {/* Sign In Modal */}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
      <div style={modalStyle} className={classes.paper}>

      <form className="app_signin">
        <center>
          <img 
              className = "app_headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
            /><br />
          <Input  
              placeholder="email"
              type="text"
              value={email}
              onChange = {(e) =>setEmail(e.target.value)}
            /><br />
          <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange = {(e) => setPassword(e.target.value)}
            /><br />
          <Button type="submit" onClick={signIn}>Sign In</Button>
        </center>
      </form>    
      </div>
      </Modal>

      {/* Header */}
      <div className="app__header">
        <img
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
        />
         {user ? 
            <Button onClick={()=>auth.signOut()}>Log out </Button>
               : 
                <div className="app_loginContainer">
                  <Button onClick={()=> setOpenSignIn(true)}>Sign In</Button>
                  <Button onClick={()=> setOpen(true)}>Sign Up</Button>
                </div>
          }
      </div>
     
      {/* post */}
      <div className="app_posts">
        <div className="app_postsLeft">
          {posts.map(({post,id})=>{
            return (
              <Post  key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            )
        })}  
        </div>

        <div className="app_postsRight">
         <InstagramEmbed 
            url="https://www.instagram.com/p/CIlhz8FAc7s/"
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={()=>{}}
            onSuccess={()=>{}}
            onAfterRender={()=>{}}
            onFailure={()=>{}}
          /> 
        </div>
        
      </div>
       {/* {console.log(posts)} */}
      {/* post   */}

      {/* ImageUpload */}
      {user?.displayName ? < ImageUpload username = {user.displayName}/> 
        : <h3> Login to Upload </h3>
      }
    </div>
  );
}

export default App;
