import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Compass, LockKeyhole, Mail } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { saveAuth } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const res = await api.post("/auth/login", form);
      saveAuth(res.data); navigate("/dashboard");
    } catch (err) { setError(err.response?.data?.message || "Unable to sign in"); }
    finally { setBusy(false); }
  }

  return <AuthLayout eyebrow="WELCOME BACK" title="Your next chapter starts here." subtitle="Sign in to continue your career discovery journey.">
    <form onSubmit={submit} className="auth-form">
      {error && <div className="alert">{error}</div>}
      <label className="field"><span>Email</span><div className="input-icon"><Mail size={18}/><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" required/></div></label>
      <label className="field"><span>Password</span><div className="input-icon"><LockKeyhole size={18}/><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" required/></div></label>
      <button className="primary-btn wide" disabled={busy}>{busy ? "Signing in..." : <>Enter CareerPath <ArrowRight size={18}/></>}</button>
    </form>
    <p className="auth-switch">New here? <Link to="/register">Create your profile</Link></p>
  </AuthLayout>;
}

function AuthLayout({ eyebrow, title, subtitle, children }) {
  return <div className="auth-page">
    <div className="auth-art">
      <div className="orb orb-one"/><div className="orb orb-two"/>
      <Link to="/login" className="brand auth-brand"><span className="brand-mark"><Compass size={20}/></span><span>Career<span>Path</span></span></Link>
      <div className="art-copy"><p className="eyebrow">CAREER DISCOVERY PLATFORM</p><h1>Turn curiosity into a <em>direction.</em></h1><p>Understand your strengths, explore possibilities, and take your next step with confidence.</p><div className="quote">“The future depends on what you do today.”</div></div>
    </div>
    <div className="auth-panel"><div className="auth-card"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p className="muted">{subtitle}</p>{children}</div></div>
  </div>;
}
