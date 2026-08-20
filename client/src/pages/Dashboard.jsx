import { useEffect, useState } from "react";
import { ArrowRight, BarChart3, CheckCircle2, ClipboardCheck, Sparkles, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const colors = ["accent-a","accent-b","accent-c","accent-d","accent-e","accent-f"];

export default function Dashboard(){
  const {user}=useAuth(); const [profile,setProfile]=useState(null); const [result,setResult]=useState(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{Promise.all([api.get("/profile"),api.get("/assessment/result")]).then(([p,r])=>{setProfile(p.data);setResult(r.data);}).finally(()=>setLoading(false));},[]);
  if(loading)return <div className="page-loader"><div className="spinner"/></div>;
  const completed=!!result; const top=result?.recommendations?.[0]; const profileFields=["education","college","branch","year","skills","interests","strengths","careerGoals"]; const filled=profileFields.filter(k=>{const v=profile?.[k];return Array.isArray(v)?v.length:v}).length; const profilePercent=Math.round((filled/profileFields.length)*100);
  return <section className="page">
    <div className="hero-row"><div><p className="eyebrow">YOUR CAREER SPACE</p><h1>Good to see you, <em>{user?.name?.split(" ")[0]}</em>.</h1><p className="muted">A clearer direction starts with understanding yourself.</p></div><Link className="primary-btn" to={completed?"/assessment":"/profile"}>{completed?"Retake assessment":"Complete profile"} <ArrowRight size={17}/></Link></div>
    <div className="stats-grid">
      <Stat icon={<UserRound/>} label="Profile strength" value={`${profilePercent}%`} sub={profilePercent===100?"All set":"Keep building it"} />
      <Stat icon={<ClipboardCheck/>} label="Assessment" value={completed?"Complete":"Pending"} sub={completed?"20 answers analyzed":"Take the assessment"} />
      <Stat icon={<BarChart3/>} label="Career matches" value={completed?result.recommendations.length:"—"} sub="Domains explored" />
    </div>
    {!completed ? <div className="empty-dashboard panel"><div className="empty-icon"><Sparkles/></div><h2>Your career map is waiting.</h2><p>Complete the 20-question assessment and CareerPath will analyze your interests and suggest career domains that fit your profile.</p><Link to="/assessment" className="primary-btn">Start assessment <ArrowRight size={17}/></Link></div>
    : <><div className="section-head"><div><p className="eyebrow">YOUR RESULTS</p><h2>Career matches</h2></div><span className="result-note"><CheckCircle2 size={16}/> Analysis complete</span></div>
      <div className="recommendation-layout">
        <div className="top-match panel"><div className="match-glow"/><span className="match-label">TOP MATCH</span><div className="match-icon">{top?.icon}</div><h2>{top?.domain}</h2><div className="score-ring"><strong>{top?.score}%</strong><span>match</span></div><p>{top?.description}</p><Link to="/assessment" className="text-link">Retake assessment <ArrowRight size={15}/></Link></div>
        <div className="career-list">{result.recommendations.slice(1).map((r,i)=><div className="career-card panel" key={r.domain}><div className={`career-icon ${colors[i]}`}>{r.icon}</div><div className="career-info"><h3>{r.domain}</h3><p>{r.description}</p><div className="mini-progress"><div style={{width:`${r.score}%`}}/></div></div><strong>{r.score}%</strong></div>)}</div>
      </div>
      <div className="insight-banner"><Sparkles size={22}/><div><b>How your result works</b><p>Your answers are converted into domain scores. The highest matching domains appear first, giving you a starting point for career exploration.</p></div></div>
    </>}
  </section>;
}
function Stat({icon,label,value,sub}){return <div className="stat-card panel"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{sub}</small></div></div>}
