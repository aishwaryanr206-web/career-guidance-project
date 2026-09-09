import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, BarChart3, BookOpen, Check, CheckCircle2, ClipboardCheck, Edit3, Plus, Save, Sparkles, Target, Trash2, TrendingUp, UserRound, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const colors = ["accent-a","accent-b","accent-c","accent-d","accent-e","accent-f"];
const defaultSkills = [
  { id: 1, name: "Python", level: "Advanced", progress: 88 },
  { id: 2, name: "SQL", level: "Advanced", progress: 80 },
  { id: 3, name: "Statistics", level: "Intermediate", progress: 72 },
  { id: 4, name: "Machine Learning", level: "Beginner", progress: 44 }
];
const defaultGoals = [
  { id: 1, title: "Complete Python analytics project", progress: 82, completed: false },
  { id: 2, title: "Finish SQL practice set", progress: 100, completed: true },
  { id: 3, title: "Create portfolio case study", progress: 35, completed: false } 
];

const selectedCareerMap = {
  "Data Science": {
    title: "Data Science",
    knowledge: ["Python ✓", "SQL ✓", "Statistics →", "Machine Learning 🔒", "Projects 🔒"],
    track: ["Python", "SQL", "Statistics", "Machine Learning", "Projects"]
  },
  "Software Development": {
    title: "Software Development",
    knowledge: ["JavaScript ✓", "React ✓", "APIs →", "Data Structures 🔒", "Projects 🔒"],
    track: ["JavaScript", "React", "APIs", "Data Structures", "Projects"]
  },
  "Business Analytics": {
    title: "Business Analytics",
    knowledge: ["Excel ✓", "SQL ✓", "Dashboarding →", "Statistics 🔒", "Business Cases 🔒"],
    track: ["Excel", "SQL", "Dashboarding", "Statistics", "Business Cases"]
  },
  "Digital Marketing": {
    title: "Digital Marketing",
    knowledge: ["Content Strategy ✓", "SEO →", "Campaign Analytics 🔒", "Brand Positioning 🔒", "Growth Projects 🔒"],
    track: ["Content Strategy", "SEO", "Campaign Analytics", "Brand Positioning", "Growth Projects"]
  },
  "UI/UX Design": {
    title: "UI/UX Design",
    knowledge: ["Research ✓", "Wireframes ✓", "Typography →", "Usability Testing 🔒", "Portfolio 🔒"],
    track: ["Research", "Wireframes", "Typography", "Usability Testing", "Portfolio"]
  },
  "Cybersecurity": {
    title: "Cybersecurity",
    knowledge: ["Networking ✓", "Risk Basics ✓", "Linux →", "Security Labs 🔒", "Projects 🔒"],
    track: ["Networking", "Risk Basics", "Linux", "Security Labs", "Projects"]
  }
};

export default function Dashboard(){
  const {user}=useAuth();
  const [profile,setProfile]=useState(null);
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(true);
  const [skills,setSkills]=useState(defaultSkills);
  const [goals,setGoals]=useState(defaultGoals);
  const [skillDraft,setSkillDraft]=useState({name:"", level:"Beginner", progress:20});
  const [skillEditId,setSkillEditId]=useState(null);
  const [goalTitle,setGoalTitle]=useState("");
  const [goalProgress,setGoalProgress]=useState(0);

  useEffect(()=>{Promise.all([api.get("/profile"),api.get("/assessment/result")]).then(([p,r])=>{setProfile(p.data);setResult(r.data);}).finally(()=>setLoading(false));},[]);

  const completed=!!result;
  const top=result?.recommendations?.[0] ?? {domain:"Career path",score:0,description:"",icon:"✦"};
  const recommendations=result?.recommendations ?? [];
  const careerTop3=recommendations.slice(0,3);
  const profileFields=["education","college","branch","year","skills","interests","strengths","careerGoals"];
  const filled=profileFields.filter(k=>{const v=profile?.[k];return Array.isArray(v)?v.length:v}).length;
  const profilePercent=Math.round((filled/profileFields.length)*100);

  const averageSkillProgress = useMemo(() => Math.round(skills.reduce((acc,item)=>acc+item.progress,0)/Math.max(skills.length,1)),[skills]);
  const completedGoals = goals.filter(g=>g.completed).length;
  const pendingGoals = goals.length - completedGoals;
  const readinessScore = Math.min(96, Math.round((top.score * 0.7) + (averageSkillProgress * 0.3)));
  const careerRoadmap = selectedCareerMap[top.domain] ?? selectedCareerMap["Data Science"];

  if(loading)return <div className="page-loader"><div className="spinner"/></div>;

  function addOrEditSkill(e){
    e.preventDefault();
    const clean = skillDraft.name.trim();
    if(!clean) return;
    if(skillEditId){
      setSkills(skills.map(s=>s.id===skillEditId ? {...s,name:clean,level:skillDraft.level,progress:Number(skillDraft.progress)} : s));
    }else{
      setSkills([{id:Date.now(),name:clean,level:skillDraft.level,progress:Number(skillDraft.progress)},...skills]);
    }
    setSkillDraft({name:"",level:"Beginner",progress:20});
    setSkillEditId(null);
  }

  function beginEditSkill(skill){
    setSkillEditId(skill.id);
    setSkillDraft({name:skill.name,level:skill.level,progress:skill.progress});
  }

  function removeSkill(id){
    setSkills(skills.filter(s=>s.id!==id));
    if(skillEditId===id){
      setSkillEditId(null);
      setSkillDraft({name:"",level:"Beginner",progress:20});
    }
  }

  function createGoal(e){
    e.preventDefault();
    const clean = goalTitle.trim();
    if(!clean) return;
    setGoals([{id:Date.now(),title:clean,progress:goalProgress,completed:goalProgress>=100},...goals]);
    setGoalTitle("");
    setGoalProgress(0);
  }

  function toggleGoal(id){
    setGoals(goals.map(g=>g.id===id ? {...g,completed:!g.completed,progress:g.completed ? 70 : 100} : g));
  }

  return <section className="page dashboard-page">
    <div className="dashboard-hero">
      <div className="dashboard-hero-copy">
        <p className="eyebrow">YOUR CAREER SPACE</p>
        <h1>Welcome back, <em>{user?.name?.split(" ")[0]}</em> 👋</h1>
        <p className="muted">Your career progress at a glance.</p>
      </div>
      <Link className="primary-btn" to={completed?"/assessment":"/profile"}>{completed?"Retake assessment":"Complete profile"} <ArrowRight size={17}/></Link>
    </div>

    <section className="dashboard-summary-grid">
      <div className="summary-card">
        <span className="summary-icon"><Target size={22}/></span>
        <span className="summary-label">Career match</span>
        <strong className="summary-value">{top.score}%</strong>
      </div>
      <div className="summary-card">
        <span className="summary-icon"><BarChart3 size={22}/></span>
        <span className="summary-label">Skills</span>
        <strong className="summary-value">{Math.round(averageSkillProgress)}%</strong>
      </div>
      <div className="summary-card">
        <span className="summary-icon"><CheckCircle2 size={22}/></span>
        <span className="summary-label">Goals</span>
        <strong className="summary-value">{Math.round((completedGoals/goals.length)*100)}%</strong>
      </div>
      <div className="summary-card">
        <span className="summary-icon"><TrendingUp size={22}/></span>
        <span className="summary-label">Readiness</span>
        <strong className="summary-value">{readinessScore}%</strong>
      </div>
    </section>

    {!completed ? <div className="empty-dashboard panel"><div className="empty-icon"><Sparkles/></div><h2>Your career map is waiting.</h2><p>Complete the 20-question assessment and CareerPath will analyze your interests and suggest career domains that fit your profile.</p><Link to="/assessment" className="primary-btn">Start assessment <ArrowRight size={17}/></Link></div>
    : <div className="dashboard-grid">
        <main className="dashboard-main-column">
          <section className="section-card panel">
            <div className="section-head">
              <div><p className="eyebrow">YOUR RESULTS</p><h2>Career recommendations</h2></div>
              <span className="result-note"><CheckCircle2 size={16}/> Analysis complete</span>
            </div>
            <div className="top3-grid">
              {careerTop3.map((r,i)=><article className="career-match-card panel" key={r.domain}>
                <div className="career-card-row">
                  <div className={`career-icon ${colors[i]}`}>{r.icon}</div>
                  <div className="career-info">
                    <span className="rank-label">#{i+1} {r.domain}</span>
                    <h3>{r.domain}</h3>
                  </div>
                </div>
                <div className="career-match-detail">
                  <span className="match-label">Career Match</span>
                  <span className="match-score">{r.score}%</span>
                </div>
                <div className="mini-progress"><div style={{width:`${r.score}%`}}/></div>
                <Link className="view-career-btn" to="/assessment">View Career <span aria-hidden="true">→</span></Link>
              </article>)}
            </div>
          </section>

          <section className="section-card panel dashboard-result-panel">
            <div className="section-head compact">
              <div><p className="eyebrow">ASSESSMENT RESULT DASHBOARD</p><h2>{top.domain}</h2></div>
              <span className="result-note"><Sparkles/> {top.score}% career match</span>
            </div>
            <div className="result-dashboard-grid">
              <ResultMetric label="Career Match" value={`${top.score}%`} icon={<Target size={16}/>} />
              <ResultMetric label="Interest Level" value={Math.min(96, top.score + 8) + "%"} icon={<Sparkles size={16}/>} />
              <ResultMetric label="Skill Level" value={`${Math.round(averageSkillProgress)}%`} icon={<BarChart3 size={16}/>} />
              <ResultMetric label="Readiness" value={`${readinessScore}%`} icon={<TrendingUp size={16}/>} />
            </div>
            <div className="insights-grid">
              <div>
                <span className="insight-label">Strengths</span>
                <ul className="insights-list">
                  {(profile?.strengths || ["Problem solving", "Curiosity"]).slice(0,3).map((s,idx)=><li key={idx}><CheckCircle2 size={14}/> {s}</li>)}
                </ul>
              </div>
              <div>
                <span className="insight-label">Areas to improve</span>
                <ul className="insights-list">
                  {careerRoadmap.track.slice(0,3).map((step,idx)=><li key={idx}><Sparkles size={14}/> {step}</li>)}
                  <li><Sparkles size={14}/> Practice projects</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="section-card panel learning-grid-panel">
            <div className="section-head compact">
              <div><p className="eyebrow">LEARNING ROADMAP</p><h2>{top.domain}</h2></div>
              <span className="result-note">Learning plan</span>
            </div>
            <div className="roadmap">
              {careerRoadmap.knowledge.map((step,i)=><div className="roadmap-row" key={i}><span className="roadmap-step">{step}</span>{i < careerRoadmap.knowledge.length - 1 && <span className="roadmap-line"/>}</div>)}
            </div>
          </section>
        </main>

        <aside className="dashboard-side-column">
          <section className="section-card panel">
            <div className="section-head compact">
              <div><p className="eyebrow">SKILLS MANAGEMENT</p><h2>Skills</h2></div>
              <span className="result-note">{skills.length}</span>
            </div>
            <form className="skill-form" onSubmit={addOrEditSkill}>
              <div className="input-combo">
                <input value={skillDraft.name} onChange={e=>setSkillDraft({...skillDraft,name:e.target.value})} placeholder="Skill name" />
                <select value={skillDraft.level} onChange={e=>setSkillDraft({...skillDraft,level:e.target.value})}>
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
                <input type="number" min="0" max="100" value={skillDraft.progress} onChange={e=>setSkillDraft({...skillDraft,progress:Math.max(0,Math.min(100,Number(e.target.value)))})} />
              </div>
              <div className="form-actions">
                <button className="primary-btn small-btn" type="submit"><Plus size={16}/>{skillEditId?"Update":"Add"}</button>
                {skillEditId && <button className="ghost-btn small-btn" type="button" onClick={()=>{setSkillEditId(null);setSkillDraft({name:"",level:"Beginner",progress:20});}}><X size={16}/> Cancel</button>}
              </div>
            </form>
            <div className="skills-list">
              {skills.map(s=><div className="skill-row" key={s.id}>
                <div className="skill-head"><span className="skill-name">{s.name}</span><span className={`level-badge level-${s.level.toLowerCase()}`}>{s.level}</span></div>
                <div className="skill-row-meta">
                  <div className="progress-track"><div className="progress-bar" style={{width:`${s.progress}%`}}/></div>
                  <span className="skill-percent">{s.progress}%</span>
                </div>
                <div className="skill-actions">
                  <button className="icon-btn small-icon" onClick={()=>beginEditSkill(s)}><Edit3 size={14}/> Edit</button>
                  <button className="icon-btn small-icon" onClick={()=>removeSkill(s.id)}><Trash2 size={14}/> Delete</button>
                </div>
              </div>)}
            </div>
          </section>

          <section className="section-card panel">
            <div className="section-head compact">
              <div><p className="eyebrow">GOALS & PROGRESS</p><h2>Student goals</h2></div>
              <span className="result-note">{completedGoals}/{goals.length} done</span>
            </div>
            <form className="goal-form" onSubmit={createGoal}>
              <div className="input-combo vertical">
                <input value={goalTitle} onChange={e=>setGoalTitle(e.target.value)} placeholder="Create a new goal" />
                <input type="number" min="0" max="100" value={goalProgress} onChange={e=>setGoalProgress(Math.max(0,Math.min(100,Number(e.target.value))))} placeholder="Progress %" />
              </div>
              <div className="form-actions"><button className="primary-btn small-btn" type="submit"><Plus size={16}/> Add</button></div>
            </form>
            <div className="goals-list">
              {goals.map(g=><div className="goal-row" key={g.id}>
                <div className="goal-row-top"><span className={g.completed ? "goal-title completed-title" : "goal-title"}>{g.title}</span><button className="icon-btn small-icon" onClick={()=>toggleGoal(g.id)}>{g.completed?<X size={14}/>:<Check size={14}/>}</button></div>
                <div className="goal-progress-row"><div className="progress-track"><div className="progress-bar" style={{width:`${g.progress}%`}}/></div><span className="goal-progress-label">{g.progress}%</span></div>
                <small className={g.completed?"goal-status complete":"goal-status pending"}>{g.completed?"Completed":"Pending"}</small>
              </div>)}
            </div>
          </section>

          <section className="section-card panel">
            <div className="section-head compact">
              <div><p className="eyebrow">ANALYTICS</p><h2>Progress charts</h2></div>
              <span className="result-note"><BarChart3 size={16}/> Report</span>
            </div>
            <div className="analytics-chart">
              <div className="chart-bars">
                <div className="chart-row"><span className="bar-label">Assessment</span><span className="bar-track"><span className="bar-fill bar-1" style={{width:`${top.score}%`}}></span></span><span className="bar-value">{top.score}%</span></div>
                <div className="chart-row"><span className="bar-label">Skills</span><span className="bar-track"><span className="bar-fill bar-2" style={{width:`${averageSkillProgress}%`}}></span></span><span className="bar-value">{averageSkillProgress}%</span></div>
                <div className="chart-row"><span className="bar-label">Goals</span><span className="bar-track"><span className="bar-fill bar-3" style={{width:`${Math.round((completedGoals/goals.length)*100)}%`}}></span></span><span className="bar-value">{Math.round((completedGoals/goals.length)*100)}%</span></div>
                <div className="chart-row"><span className="bar-label">Readiness</span><span className="bar-track"><span className="bar-fill bar-4" style={{width:`${readinessScore}%`}}></span></span><span className="bar-value">{readinessScore}%</span></div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    }
  </section>;
}

function Stat({icon,label,value,sub}){return <div className="stat-card panel"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{sub}</small></div></div>}
function ResultMetric({label,value,icon}){return <div className="result-metric"><span className="metric-icon">{icon}</span><span className="metric-label">{label}</span><strong>{value}</strong></div>}
