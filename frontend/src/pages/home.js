import React, { useContext, useEffect, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import DashNav from './DashNav'
import { RESERVED_CODES } from './GuestJoinModal'
import "./dashboard.css"

import VideocamIcon from '@mui/icons-material/Videocam'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import AddIcon from '@mui/icons-material/Add'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import HistoryIcon from '@mui/icons-material/History'
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined'

// random readable meeting code like "kqz-mdvr-twa"
const generateCode = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const part = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return `${part(3)}-${part(4)}-${part(3)}`;
}

const formatWhen = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d)) return "";
    return d.toLocaleString(undefined, { day: "2-digit", month: "short", hour: "numeric", minute: "2-digit" });
}

function HomeComponent() {

    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [codeError, setCodeError] = useState("");
    const [recent, setRecent] = useState([]);
    const [loadingRecent, setLoadingRecent] = useState(true);

    const { addToUserHistory, getHistoryOfUser } = useContext(AuthContext);

    // Load the latest few meetings for the "Recent meetings" card
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const history = await getHistoryOfUser();
                if (!cancelled && Array.isArray(history)) {
                    const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
                    setRecent(sorted.slice(0, 4));
                }
            } catch (e) {
                // history card just stays empty
            } finally {
                if (!cancelled) setLoadingRecent(false);
            }
        })();
        return () => { cancelled = true; };
        // eslint-disable-next-line
    }, []);

    const joinMeeting = async (code) => {
        const clean = (code || "").trim();
        if (!clean) return;
        if (RESERVED_CODES.includes(clean.toLowerCase())) {
            setCodeError("That code is reserved. Please choose a different one.");
            return;
        }
        try {
            await addToUserHistory(clean)
        } catch (e) {
            console.log(e);   // joining should still work even if saving history fails
        }
        navigate(`/${encodeURIComponent(clean)}`)
    }

    let handleJoinVideoCall = () => joinMeeting(meetingCode);
    let handleNewMeeting = () => joinMeeting(generateCode());

    return (
        <div className='db'>
            <DashNav active="home" />

            <main className='db-main db-home'>

                {/* ---------- LEFT: join / start ---------- */}
                <section className='db-home-left'>
                    <span className='db-badge'><span className='db-dot'></span> Ready to connect</span>

                    <h1>Start or join a <span className='db-accent'>meeting</span></h1>
                    <p className='db-lead'>
                        Enter a meeting code to join, or start a brand-new meeting and
                        share the code with anyone.
                    </p>

                    <form
                        className='db-join'
                        onSubmit={(e) => { e.preventDefault(); handleJoinVideoCall(); }}
                    >
                        <div className='db-input'>
                            <KeyboardIcon />
                            <input
                                type="text"
                                placeholder="Enter meeting code"
                                value={meetingCode}
                                onChange={(e) => { setMeetingCode(e.target.value); setCodeError(""); }}
                                aria-label="Meeting code"
                            />
                        </div>
                        <button type="submit" className='db-btn db-btn-primary' disabled={!meetingCode.trim()}>
                            Join <ArrowForwardIcon />
                        </button>
                    </form>
                    {codeError && <p className='db-field-error' role="alert">{codeError}</p>}

                    <div className='db-or'><span>or</span></div>

                    <div className='db-actions'>
                        <button className='db-btn db-btn-ghost' onClick={handleNewMeeting}>
                            <AddIcon /> New Meeting
                        </button>
                        <button className='db-btn db-btn-ghost' onClick={() => navigate("/history")}>
                            <HistoryIcon /> View History
                        </button>
                    </div>
                </section>

                {/* ---------- RIGHT: recent meetings ---------- */}
                <section className='db-panel'>
                    <div className='db-panel-head'>
                        <div>
                            <h2>Recent meetings</h2>
                            <p>Your latest calls at a glance</p>
                        </div>
                        <button className='db-link' onClick={() => navigate("/history")}>
                            View all <ArrowForwardIcon />
                        </button>
                    </div>

                    {loadingRecent ? (
                        <div className='db-skel-list'>
                            <div className='db-skel'></div><div className='db-skel'></div><div className='db-skel'></div>
                        </div>
                    ) : recent.length === 0 ? (
                        <div className='db-empty-sm'>
                            <span className='db-empty-icon'><MeetingRoomOutlinedIcon /></span>
                            <strong>No meetings yet</strong>
                            <p>Join or start a meeting and it will show up here.</p>
                        </div>
                    ) : (
                        <ul className='db-recent'>
                            {recent.map((m, i) => (
                                <li key={m._id || i}>
                                    <span className='db-rec-icon'><VideocamIcon /></span>
                                    <div className='db-rec-info'>
                                        <strong>{m.meetingCode}</strong>
                                        <span>{formatWhen(m.date)}</span>
                                    </div>
                                    <button className='db-chip-btn' onClick={() => joinMeeting(m.meetingCode)}>
                                        Rejoin
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </main>
        </div>
    )
}


export default withAuth(HomeComponent)