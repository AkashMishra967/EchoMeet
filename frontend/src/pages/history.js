import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import withAuth from '../utils/withAuth'
import DashNav from './DashNav'
import "./dashboard.css"

import VideocamIcon from '@mui/icons-material/Videocam'
import SearchIcon from '@mui/icons-material/Search'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import HistoryIcon from '@mui/icons-material/History'
import RefreshIcon from '@mui/icons-material/Refresh'
import AddIcon from '@mui/icons-material/Add'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

const formatDate = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}
const formatTime = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d)) return "—";
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function History() {

    const { getHistoryOfUser, addToUserHistory } = useContext(AuthContext);

    const [meetings, setMeetings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [query, setQuery] = useState("")
    const [copied, setCopied] = useState(null)

    const routeTo = useNavigate();

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const history = await getHistoryOfUser();
            if (Array.isArray(history)) {
                // newest first
                setMeetings([...history].sort((a, b) => new Date(b.date) - new Date(a.date)));
            } else {
                setError(history?.message || "Could not load your history.");
            }
        } catch (e) {
            setError("Could not load your history. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => { fetchHistory(); }, [fetchHistory]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return meetings;
        return meetings.filter(m => (m.meetingCode || "").toLowerCase().includes(q));
    }, [meetings, query]);

    const uniqueRooms = useMemo(() => new Set(meetings.map(m => m.meetingCode)).size, [meetings]);

    const rejoin = async (code) => {
        try { await addToUserHistory(code); } catch (e) { console.log(e); }
        routeTo(`/${encodeURIComponent(code)}`);
    }

    const copyLink = async (code, key) => {
        const link = `${window.location.origin}/${encodeURIComponent(code)}`;
        try {
            await navigator.clipboard.writeText(link);
        } catch (e) {
            // fallback for older browsers / non-https
            const t = document.createElement("textarea");
            t.value = link; document.body.appendChild(t); t.select();
            try { document.execCommand("copy"); } catch (_) { }
            document.body.removeChild(t);
        }
        setCopied(key);
        setTimeout(() => setCopied(null), 1800);
    }

    return (
        <div className='db'>
            <DashNav active="history" />

            <main className='db-main db-hist'>

                {/* ---------- header ---------- */}
                <div className='db-hist-head'>
                    <div>
                        <h1>Meeting <span className='db-accent'>history</span></h1>
                        <p className='db-lead'>Every meeting you've joined, newest first.</p>
                    </div>
                    <button className='db-btn db-btn-primary' onClick={() => routeTo("/home")}>
                        <AddIcon /> New / Join Meeting
                    </button>
                </div>

                {/* ---------- stats ---------- */}
                {!loading && !error && meetings.length > 0 && (
                    <div className='db-stats'>
                        <div><strong>{meetings.length}</strong><span>Total meetings</span></div>
                        <div><strong>{uniqueRooms}</strong><span>Unique rooms</span></div>
                        <div><strong>{formatDate(meetings[0].date)}</strong><span>Last meeting</span></div>
                    </div>
                )}

                {/* ---------- search ---------- */}
                {!loading && !error && meetings.length > 0 && (
                    <div className='db-input db-search'>
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Search by meeting code"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            aria-label="Search meetings"
                        />
                        <span className='db-count'>{filtered.length} / {meetings.length}</span>
                    </div>
                )}

                {/* ---------- content ---------- */}
                {loading ? (
                    <div className='db-skel-list'>
                        <div className='db-skel tall'></div><div className='db-skel tall'></div><div className='db-skel tall'></div>
                    </div>
                ) : error ? (
                    <div className='db-empty'>
                        <span className='db-empty-icon danger'><ErrorOutlineIcon /></span>
                        <h3>Something went wrong</h3>
                        <p>{error}</p>
                        <button className='db-btn db-btn-ghost' onClick={fetchHistory}><RefreshIcon /> Try again</button>
                    </div>
                ) : meetings.length === 0 ? (
                    <div className='db-empty'>
                        <span className='db-empty-icon'><HistoryIcon /></span>
                        <h3>No meetings yet</h3>
                        <p>Meetings you join will be saved here so you can quickly rejoin them.</p>
                        <button className='db-btn db-btn-primary' onClick={() => routeTo("/home")}>
                            <AddIcon /> Start a meeting
                        </button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className='db-empty'>
                        <span className='db-empty-icon'><SearchIcon /></span>
                        <h3>No results</h3>
                        <p>No meeting matches "{query}".</p>
                    </div>
                ) : (
                    <ul className='db-list'>
                        {filtered.map((e, i) => {
                            const key = e._id || i;
                            return (
                                <li className='db-item' key={key}>
                                    <span className='db-item-icon'><VideocamIcon /></span>

                                    <div className='db-item-info'>
                                        <strong>{e.meetingCode}</strong>
                                        <div className='db-meta'>
                                            <span><CalendarTodayOutlinedIcon /> {formatDate(e.date)}</span>
                                            <span><AccessTimeIcon /> {formatTime(e.date)}</span>
                                        </div>
                                    </div>

                                    <div className='db-item-actions'>
                                        <button
                                            className={`db-icon-btn ${copied === key ? 'ok' : ''}`}
                                            onClick={() => copyLink(e.meetingCode, key)}
                                            title="Copy meeting link"
                                            aria-label="Copy meeting link"
                                        >
                                            {copied === key ? <CheckIcon /> : <ContentCopyIcon />}
                                        </button>
                                        <button className='db-btn db-btn-primary db-btn-sm' onClick={() => rejoin(e.meetingCode)}>
                                            Rejoin
                                        </button>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </main>
        </div>
    )
}

export default withAuth(History)