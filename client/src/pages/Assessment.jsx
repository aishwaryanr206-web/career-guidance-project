import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const options = [
  { value:1, label:"Not me" }, { value:2, label:"A little" }, { value:3, label:"Maybe" }, { value:4, label:"Sounds like me" }, { value:5, label:"Absolutely" }
];

export default function Assessment(){
  const [questions,setQuestions]=useState([]); const [answers,setAnswers]=useState({}); const [index,setIndex]=useState(0); const [busy,setBusy]=useState(false); const [error,setError]=useState("");
  const navigate=useNavigate();
  useEffect(()=>{api.get("/assessment/questions").then(r=>setQuestions(r.data)).catch(e=>setError(e.response?.data?.message||"Could not load assessment"));},[]);
  if(!questions.length)return <div className="page-loader">{error?<div className="alert">{error}</div>:<div className="spinner"/>}</div>;
  const q=questions[index], answered=answers[q.id]; const progress=Math.round(((index+1)/questions.length)*100);
  function choose(value){setAnswers({...answers,[q.id]:value});}
  function next(){if(!answered)return; if(index<questions.length-1)setIndex(index+1); else submit();}
  async function submit(){if(Object.keys(answers).length!==questions.length)return;setBusy(true);try{const payload=questions.map(q=>({questionId:q.id,value:answers[q.id]}));await api.post("/assessment/submit",{answers:payload});navigate("/dashboard");}catch(e){setError(e.response?.data?.message||"Submission failed");}finally{setBusy(false);}}
  return <section className="page assessment-page">
    <div className="assessment-top"><div><p className="eyebrow">CAREER ASSESSMENT</p><h1>Find the work that feels like you.</h1><p className="muted">There are no right answers. Choose what feels most natural to you.</p></div><div className="assessment-badge"><ClipboardCheck size={18}/>{index+1} / {questions.length}</div></div>
    <div className="progress-wrap"><div className="progress-label"><span>Progress</span><b>{progress}%</b></div><div className="progress-track"><div style={{width:`${progress}%`}}/></div></div>
    <div className="question-card"><span className="question-number">QUESTION {String(index+1).padStart(2,"0")}</span><h2>{q.text}</h2><div className="options">{options.map(o=><button key={o.value} className={`option ${answered===o.value?"selected":""}`} onClick={()=>choose(o.value)}><span className="option-dot">{answered===o.value&&<CheckCircle2 size={20}/>}</span><span>{o.label}</span><small>{o.value}/5</small></button>)}</div></div>
    {error&&<div className="alert">{error}</div>}
    <div className="assessment-actions"><button className="ghost-btn" disabled={index===0} onClick={()=>setIndex(index-1)}><ArrowLeft size={17}/> Previous</button><button className="primary-btn" disabled={!answered||busy} onClick={next}>{busy?"Analyzing...":index===questions.length-1?<>See my results <Sparkles size={17}/></>:<>Next question <ArrowRight size={17}/></>}</button></div>
  </section>;
}
