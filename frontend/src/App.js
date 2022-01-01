import { useState, useEffect, useRef } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Room, Star } from '@material-ui/icons';
import "./app.css";
import axios from 'axios';
import { format } from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("pinUser"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [editEnd, setEditEnd] = useState(false);
  const [viewport, setViewport] = useState({    
    latitude: 13.736717,
    longitude: 100.523186,
    zoom: 5
  });
  const titleRef = useRef();
  const descRef = useRef();
  const ratingRef = useRef();

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
    
    return setEditEnd(false);
  }, [editEnd]);

  const handleMarkerClick = (id, latitude, longitude) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: latitude, longitude: longitude });
  };

  const handleAddClick = (e) => {
    const [longitude, latitude] = e.lngLat;
    setNewPlace({
      latitude,
      longitude
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title: titleRef.current.value,
      desc: descRef.current.value,
      rating: ratingRef.current.value,
      latitude: newPlace.latitude,
      longitude: newPlace.longitude
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("pinUser");
    setCurrentUser(null);
  };

  const handleDelete = async (pinId) => {
    try {
        await axios.delete(`/pins/${pinId}`, { 
            data: {username: currentUser }
        });
      
        setEditEnd(true);
    } catch (err) {
      console.log(err);
    }        
  };

  const handleUpdate = async (pin) => {
    try {
      await axios.put(`/pins/${pin._id}`, {
        username: currentUser,
        title: titleRef.current.value,
        desc: descRef.current.value,
        rating: ratingRef.current.value
      });

      setUpdateMode(false);
      setEditEnd(true);
    } catch (err) {
      console.log(err);
    }   
  };

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        width="100vw"
        height="100vh"
        mapStyle="mapbox://styles/nalary/ckwbpidz040w814mgm1yjewqy"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        onDblClick={handleAddClick}
        transitionDuration="200"
      >
        {pins.map(pin => (
          <div key={pin._id}  >
            <Marker 
              latitude={pin.latitude} 
              longitude={pin.longitude} 
              offsetLeft={-viewport.zoom * 2.5} 
              offsetTop={-viewport.zoom * 5}                         
            >
              <Room 
                style={{ 
                  fontSize: viewport.zoom * 5, 
                  color: pin.username === currentUser ? "tomato" : "slateblue", 
                  cursor: "pointer" 
                }} 
                onClick={() => handleMarkerClick(pin._id, pin.latitude, pin.longitude)}
              />
            </Marker>

            {pin._id === currentPlaceId && (
              <Popup
                latitude={pin.latitude} 
                longitude={pin.longitude}
                closeButton={true}
                closeOnClick={false}
                anchor="right" 
                onClose={() => {
                  setCurrentPlaceId(null);
                  setUpdateMode(false);
                }}
                className="popup"
              > 
                {updateMode ? (
                  <div className="updateForm">
                    <label>Title</label>
                    <input ref={titleRef} defaultValue={pin.title}/>
                    <label>Review</label>
                    <textarea ref={descRef} defaultValue={pin.desc}/>
                    <label>Rating</label>
                    <select ref={ratingRef} defaultValue={pin.rating}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                    <button className="updateButton" onClick={() => handleUpdate(pin)}>Update Pin</button>
                  </div>
                ) : (
                  <div className="card">
                    {pin.username === currentUser && (
                      <div className="cardEdit">
                        <i className="cardIcon far fa-edit" onClick={() => setUpdateMode(true)}/>
                        <i className="cardIcon far fa-trash-alt" onClick={() => handleDelete(pin._id)}/>
                      </div>
                    )}

                    <label>Place</label>
                    <h4 className="place">{pin.title}</h4>
                    <label>Review</label>
                    <p className="desc">{pin.desc}</p>
                    <label>Rating</label>
                    <div className="stars">
                      {/* {Array(pin.rating).fill(<Star className="star"/>)} */}
                      {Array.from({length: pin.rating}, (star, index) => <Star key={index} className="star"/>)}
                    </div>
                    <label>Information</label>
                    <span className="username">Created by <b>{pin.username}</b></span>
                    <span className="date">{format(pin.updatedAt)}</span>
                  </div>
                )}
              </Popup>
            )}                      
          </div>
        ))}

        {newPlace && (
          <Popup
            latitude={newPlace.latitude} 
            longitude={newPlace.longitude}
            closeButton={true}
            closeOnClick={false}
            anchor="left" 
            onClose={() => setNewPlace(null)}
            className="popup"
          >
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input placeholder="Enter a title" ref={titleRef}/>
              <label>Review</label>
              <textarea placeholder="Say us something about this place." ref={descRef}/>
              <label>Rating</label>
              <select ref={ratingRef}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitButton" type="submit">Add Pin</button>
            </form>
          </Popup>
        )}

        {currentUser ? (
          <button className="button logout" onClick={handleLogout}>Logout</button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>Login</button>
            <button className="button register" onClick={() => setShowRegister(true)}>Register</button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister}/>}
        {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>} 
      </ReactMapGL>      
    </div>
  );
}

export default App;
