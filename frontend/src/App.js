import { useEffect } from 'react';
import './App.css';
import {Route,BrowserRouter as Router,Routes} from 'react-router-dom';
import LandingPage from './pages/landing';
import Authentication from './pages/Authentication.js'
import { AuthProvider } from './context/AuthContext.js';
import HomeComponent from './pages/home';
import VideoMeetComponent from './pages/VideoMeet.js';
import History from './pages/history.js';
import ServerLoader from './pages/ServerLoader';
import server from './environment';

function App() {

  // wake the (free) backend in the background as soon as the site opens,
  // so it is usually ready by the time the user logs in
  useEffect(() => {
    fetch(`${server}/health`, { mode: 'no-cors' }).catch(() => {});
  }, []);

  return(
    <>
<Router>
  <AuthProvider>
  <Routes>
    <Route path='/'element={<LandingPage/>} />
    <Route path="auth" element={<Authentication />} />
    <Route path="/history" element={<History />} />
    <Route path="/home" element={<HomeComponent />} />
  <Route path="/:url" element={<VideoMeetComponent />} />
  </Routes>
  </AuthProvider>
  <ServerLoader />
</Router>


    </>
  );
}

export default App;