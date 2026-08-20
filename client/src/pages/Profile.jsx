import { useEffect, useState } from "react";
import { Save, Sparkles, UserRound } from "lucide-react";
import api from "../services/api";
import Field from "../components/Field";

const split = v => Array.isArray(v) ? v.join(", ") : (v || "");
const list = v => v.split(",").map(x=>x.trim()).filter(Boolean);

export default function Profile(){
  const [form,setForm]=useState({}); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [message,setMessage]=useState("");
  useEffect(()=>{api.get("/profile").then(r=>setForm(r.data||{})).finally(()=>setLoading(false));},[]);
  const set=(k,v)=>setForm({...form,[k]:v});
  async function save(e){e.preventDefault();setSaving(true);setMessage("");try{await api.put("/profile",{...form,subjects:list(form.subjects||""),skills:list(form.skills||""),interests:list(form.interests||""),strengths:list(form.strengths||"")});setMessage("Profile saved successfully.");}catch(err){setMessage(err.response?.data?.message||"Could not save profile.");}finally{setSaving(false);}}
  if(loading)return <div className="page-loader"><div className="spinner"/></div>;
  return <section className="page">
    <div className="page-heading"><div><p className="eyebrow">STUDENT PROFILE</p><h1>Shape your career profile.</h1><p className="muted">Tell us what makes you, you. These details improve your career recommendations.</p></div><div className="heading-icon"><UserRound/></div></div>
    <form onSubmit={save} className="profile-grid">
      <div className="panel form-panel"><h3>Personal & academic</h3><p className="section-note">Your basic student information.</p><div className="two-col">
        <Field label="Phone" value={form.phone} onChange={v=>set("phone",v)} placeholder="+91 00000 00000"/>
        <Field label="Education" value={form.education} onChange={v=>set("education",v)} placeholder="B.Tech / B.Sc / BCA"/>
        <Field label="College / University" value={form.college} onChange={v=>set("college",v)} placeholder="Your institution"/>
        <Field label="Branch / Specialization" value={form.branch} onChange={v=>set("branch",v)} placeholder="AI & ML / CSE / etc."/>
        <Field label="Year of study" value={form.year} onChange={v=>set("year",v)} placeholder="3rd Year"/>
        <Field label="Subjects you enjoy" value={split(form.subjects)} onChange={v=>set("subjects",v)} placeholder="Python, Maths, DBMS"/>
      </div></div>
      <div className="panel form-panel"><h3>Your strengths</h3><p className="section-note">Use comma-separated values.</p>
        <label className="field"><span>Technical skills</span><input value={split(form.skills)} onChange={e=>set("skills",e.target.value)} placeholder="Python, React, SQL, Machine Learning"/></label>
        <label className="field"><span>Interests</span><input value={split(form.interests)} onChange={e=>set("interests",e.target.value)} placeholder="AI, Web Development, Design"/></label>
        <label className="field"><span>Strengths</span><input value={split(form.strengths)} onChange={e=>set("strengths",e.target.value)} placeholder="Problem solving, creativity, communication"/></label>
        <label className="field"><span>Career goals</span><textarea value={form.careerGoals||""} onChange={e=>set("careerGoals",e.target.value)} placeholder="Where would you like your skills to take you?"/></label>
        <label className="field"><span>Short bio</span><textarea value={form.bio||""} onChange={e=>set("bio",e.target.value)} placeholder="A short introduction about yourself."/></label>
      </div>
      <div className="save-row">{message&&<span className="success-msg"><Sparkles size={16}/>{message}</span>}<button className="primary-btn" disabled={saving}><Save size={17}/>{saving?"Saving...":"Save profile"}</button></div>
    </form>
  </section>;
}
