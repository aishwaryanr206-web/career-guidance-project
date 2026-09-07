import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Compass, LockKeyhole, Mail, UserRound } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  const { saveAuth }=useAuth(); const navigate=useNavigate();
  async function submit(e){
    e.preventDefault(); setError(""); setBusy(true);
    try { const res=await api.post("/auth/register",form); saveAuth(res.data); navigate("/profile"); }
    catch(err){setError(err.response?.data?.message||"Unable to create account");}
    finally{setBusy(false);}
  }
  return <div className="auth-page">
    <div className="auth-art"><div className="orb orb-one"/><div className="orb orb-two"/>
      <Link to="/login" className="brand auth-brand"><span className="brand-mark"><Compass size={20}/></span><span>Career<span>Path</span></span></Link>
      <div className="art-copy"><p className="eyebrow">YOUR CAREER, YOUR STORY</p><h1>There is more than <em>one</em> way forward.</h1><p>Build a student profile and discover career domains aligned with the way you think, create and solve.</p><div className="mini-stats"><div><b>20</b><span>Assessment questions</span></div><div><b>6</b><span>Career domains</span></div></div>
      </div>
    </div>
    <div className="auth-panel"><div className="auth-card"><p className="eyebrow">GET STARTED</p><h2>Create your account.</h2><p className="muted">Your career discovery space is one step away.</p>
      <form onSubmit={submit} className="auth-form">{error&&<div className="alert">{error}</div>}
        <label className="field"><span>Full name</span><div className="input-icon"><UserRound size={18}/><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" required/></div></label>
        <label className="field"><span>Email</span><div className="input-icon"><Mail size={18}/><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" required/></div></label>
        <label className="field"><span>Password</span><div className="input-icon"><LockKeyhole size={18}/><input type="password" minLength="6" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="At least 6 characters" required/></div></label>
        <button className="primary-btn wide" disabled={busy}>{busy?"Creating...":<>Start my journey <ArrowRight size={18}/></>}</button>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </div></div>
  </div>;
}
