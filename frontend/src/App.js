import './App.css';
import {Route,BrowserRouter as Router,Routes} from 'react-router-dom';
import LandingPage from './pages/landing';
import Authentication from './pages/Authentication.js'
import { AuthProvider } from './context/AuthContext.js';
import HomeComponent from './pages/home';
import VideoMeetComponent from './pages/VideoMeet.js';
import History from './pages/history.js';

function App() {
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
</Router>


    </>
  );
}

export default App;