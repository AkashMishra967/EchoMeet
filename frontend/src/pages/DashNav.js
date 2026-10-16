import React from 'react'
import { useNavigate } from 'react-router-dom'
import VideocamIcon from '@mui/icons-material/Videocam'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import HistoryIcon from '@mui/icons-material/History'
import LogoutIcon from '@mui/icons-material/Logout'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

// Shared top bar for the logged-in pages (Home + History)
export default function DashNav({ active }) {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
    }

    return (
        <header className='db-nav'>
            <div className='db-nav-inner'>
                <div className='db-logo' onClick={() => navigate("/home")}>
                    <span className='db-logo-icon'><VideocamIcon /></span>
                    <span className='db-logo-text'>Echo<b>Meet</b></span>
                </div>

                <nav className='db-nav-links'>
                    <button
                        className={`db-navbtn ${active === 'home' ? 'active' : ''}`}
                        onClick={() => navigate("/home")}
                    >
                        <HomeOutlinedIcon /> <span>Home</span>
                    </button>
                    <button
                        className={`db-navbtn ${active === 'history' ? 'active' : ''}`}
                        onClick={() => navigate("/history")}
                    >
                        <HistoryIcon /> <span>History</span>
                    </button>
                    <button
                        className={`db-navbtn ${active === 'about' ? 'active' : ''}`}
                        onClick={() => navigate("/about")}
                    >
                        <InfoOutlinedIcon /> <span>About</span>
                    </button>
                    <button className='db-navbtn db-logout' onClick={logout}>
                        <LogoutIcon /> <span>Logout</span>
                    </button>
                </nav>
            </div>
        </header>
    )
}