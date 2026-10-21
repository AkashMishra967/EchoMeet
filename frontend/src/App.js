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
import About from './pages/About';
import server from './environment';

function App() {

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
    <Route path="/about" element={<About />} />
  <Route path="/:url" element={<VideoMeetComponent />} />
  </Routes>
  </AuthProvider>
  <ServerLoader />
</Router>


    </>
  );
}

export default App;