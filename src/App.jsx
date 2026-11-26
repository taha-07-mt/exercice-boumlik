import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Routes, Route, Navigate, NavLink, useNavigate, useParams, Link, Outlet } from 'react-router-dom'
import { GraduationCap, LayoutDashboard, Users, UserPlus, LogOut, Search, Plus, Pencil, Trash2, Eye, ArrowLeft, BookOpen, Menu, X } from 'lucide-react'
import { initialStudents } from './data'

const Store = createContext(null)
const useStore = () => useContext(Store)
const read = (key, fallback) => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback } catch { return fallback }
}

function App() {
  const [students, setStudents] = useState(() => read('edu_students', initialStudents))
  const [loggedIn, setLoggedIn] = useState(() => read('edu_logged', false))
  useEffect(() => localStorage.setItem('edu_students', JSON.stringify(students)), [students])
  useEffect(() => localStorage.setItem('edu_logged', JSON.stringify(loggedIn)), [loggedIn])
  const value = useMemo(() => ({ students, setStudents, loggedIn, setLoggedIn }), [students, loggedIn])
  return <Store.Provider value={value}>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={loggedIn ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/app" element={loggedIn ? <Shell /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="etudiants" element={<Students />} />
        <Route path="etudiants/nouveau" element={<StudentForm />} />
        <Route path="etudiants/:id" element={<StudentDetails />} />
        <Route path="etudiants/:id/modifier" element={<StudentForm />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Store.Provider>
}

function Landing() {
  return <main className="landing">
    <nav className="landing-nav"><Link to="/" className="brand"><span className="brand-icon"><GraduationCap size={22}/></span> EduManage</Link><Link className="btn btn-outline" to="/login">Se connecter</Link></nav>
    <section className="hero">
      <div className="eyebrow"><span className="dot"/> PLATEFORME DE GESTION SCOLAIRE</div>
      <h1>La gestion des étudiants,<br/><span>en toute simplicité.</span></h1>
      <p>Une plateforme claire et intuitive pour organiser les dossiers, suivre les étudiants et gérer votre établissement au quotidien.</p>
      <div className="hero-actions"><Link className="btn btn-primary" to="/login">Accéder au tableau de bord <span>→</span></Link><a className="text-link" href="#features">Découvrir les fonctionnalités</a></div>
      <div className="hero-visual"><div className="visual-top"><div><span className="mini-label">VUE D'ENSEMBLE</span><h3>Tableau de bord</h3></div><span className="live">● En direct</span></div><div className="stat-grid"><div className="mini-stat"><span>Total étudiants</span><b>248</b><small>↗ 12% ce mois</small></div><div className="mini-stat"><span>Filières</span><b>08</b><small>Programmes actifs</small></div><div className="mini-stat"><span>Présence</span><b>94%</b><small>Cette semaine</small></div></div><div className="fake-table"><div className="fake-row head"><span>ÉTUDIANT</span><span>FILIÈRE</span><span>STATUT</span></div>{[['Amine Zahraoui','Développement Digital'],['Sara Benali','Gestion des Entreprises'],['Omar Idrissi','Infrastructure Digitale']].map((r,i)=><div className="fake-row" key={r[0]}><span className="fake-person"><i>{r[0].split(' ').map(x=>x[0]).join('')}</i>{r[0]}</span><span>{r[1]}</span><span className="pill">Actif</span></div>)}</div></div>
    </section>
    <section className="features" id="features"><span className="eyebrow">TOUT AU MÊME ENDROIT</span><h2>Les outils essentiels pour votre établissement</h2><div className="feature-grid"><Feature icon={<Users/>} title="Gestion des étudiants" text="Consultez, recherchez et organisez tous les dossiers étudiants."/><Feature icon={<Pencil/>} title="Modification rapide" text="Ajoutez ou mettez à jour les informations en quelques clics."/><Feature icon={<LayoutDashboard/>} title="Vue d'ensemble" text="Retrouvez les indicateurs clés dans un tableau de bord simple."/></div></section>
    <footer>© 2026 EduManage · Projet pédagogique React</footer>
  </main>
}
function Feature({icon,title,text}) { return <div className="feature-card"><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{text}</p></div> }

function Login() {
  const { setLoggedIn } = useStore(), navigate = useNavigate()
  const [email,setEmail] = useState('admin@edumanage.ma'), [password,setPassword] = useState('admin123'), [error,setError] = useState('')
  function submit(e) { e.preventDefault(); if (email.trim() && password.trim()) { setLoggedIn(true); navigate('/app/dashboard') } else setError('Veuillez remplir tous les champs.') }
  return <main className="auth-page"><Link to="/" className="brand auth-brand"><span className="brand-icon"><GraduationCap size={22}/></span> EduManage</Link><form className="auth-card" onSubmit={submit}><div className="auth-symbol"><GraduationCap size={28}/></div><span className="eyebrow">BON RETOUR</span><h1>Connexion</h1><p>Connectez-vous pour accéder à votre espace de gestion.</p><label>Adresse e-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="nom@exemple.com" required/></label><label>Mot de passe<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Votre mot de passe" required/></label>{error && <div className="error">{error}</div>}<button className="btn btn-primary full">Se connecter <span>→</span></button><div className="demo-hint">Démo : utilisez les identifiants préremplis, ou n'importe quels champs non vides.</div><Link to="/" className="back-link">← Retour à l'accueil</Link></form></main>
}

function Shell() {
  const { setLoggedIn } = useStore()
  const [open,setOpen] = useState(false)
  const navigate = useNavigate()
  function logout(){setLoggedIn(false);navigate('/')}
  return <div className="app-shell"><aside className={open?'sidebar open':'sidebar'}><Link to="/" className="brand side-brand"><span className="brand-icon"><GraduationCap size={22}/></span> EduManage</Link><div className="side-caption">ESPACE ADMINISTRATION</div><NavLink onClick={()=>setOpen(false)} to="/app/dashboard" className={({isActive})=>isActive?'side-link active':'side-link'}><LayoutDashboard size={18}/> Tableau de bord</NavLink><NavLink onClick={()=>setOpen(false)} to="/app/etudiants" className={({isActive})=>isActive?'side-link active':'side-link'}><Users size={18}/> Étudiants</NavLink><div className="side-bottom"><div className="admin-card"><div className="avatar">AD</div><div><b>Administrateur</b><small>admin@edumanage.ma</small></div></div><button className="side-link logout" onClick={logout}><LogOut size={18}/> Déconnexion</button></div></aside><main className="main-area"><header className="topbar"><button className="mobile-menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><div><span className="crumb">Espace administration</span><span className="top-title">Gestion des étudiants</span></div><div className="top-avatar">AD</div></header><div className="page-content"><Outlet/></div></main></div>
}
function Dashboard() {
  const {students}=useStore()
  const active=students.filter(s=>s.status==='Actif').length
  return <><div className="page-heading"><div><span className="eyebrow">APERÇU GÉNÉRAL</span><h1>Tableau de bord</h1><p>Bienvenue dans votre espace de gestion.</p></div><Link to="/app/etudiants/nouveau" className="btn btn-primary"><Plus size={17}/> Ajouter un étudiant</Link></div><div className="stats"><Stat icon={<Users/>} label="Total étudiants" value={students.length} note="Dossiers enregistrés"/><Stat icon={<BookOpen/>} label="Filières" value={new Set(students.map(s=>s.filiere)).size} note="Filières représentées"/><Stat icon={<GraduationCap/>} label="Étudiants actifs" value={active} note="Statut actif"/></div><section className="panel"><div className="panel-heading"><div><h2>Étudiants récemment ajoutés</h2><p>Consultez les derniers dossiers enregistrés.</p></div><Link className="text-link" to="/app/etudiants">Voir tout →</Link></div><StudentTable rows={students.slice(-5).reverse()}/></section></>
}
function Stat({icon,label,value,note}) {return <div className="stat-card"><div className="stat-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small>{note}</small></div>}
function Students() {
  const {students,setStudents}=useStore(),[query,setQuery]=useState('')
  const filtered=students.filter(s=>`${s.firstName} ${s.lastName} ${s.email} ${s.filiere}`.toLowerCase().includes(query.toLowerCase()))
  function remove(id){if(window.confirm('Voulez-vous vraiment supprimer cet étudiant ?'))setStudents(prev=>prev.filter(s=>s.id!==id))}
  return <><div className="page-heading"><div><span className="eyebrow">ANNUAIRE</span><h1>Liste des étudiants</h1><p>Recherchez et gérez les dossiers de vos étudiants.</p></div><Link to="/app/etudiants/nouveau" className="btn btn-primary"><Plus size={17}/> Nouvel étudiant</Link></div><section className="panel"><div className="list-toolbar"><div className="search-box"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher par nom, e-mail ou filière..."/></div><span className="result-count">{filtered.length} résultat(s)</span></div><StudentTable rows={filtered} onDelete={remove}/>{filtered.length===0&&<div className="empty">Aucun étudiant ne correspond à votre recherche.</div>}</section></>
}
function StudentTable({rows,onDelete}) {
 return <div className="table-wrap"><table><thead><tr><th>ÉTUDIANT</th><th>FILIÈRE</th><th>NIVEAU</th><th>STATUT</th><th className="actions-col">ACTIONS</th></tr></thead><tbody>{rows.map(s=><tr key={s.id}><td><div className="student-cell"><div className="student-avatar">{s.firstName[0]}{s.lastName[0]}</div><div><b>{s.firstName} {s.lastName}</b><small>{s.email}</small></div></div></td><td>{s.filiere}</td><td>{s.level}</td><td><span className={s.status==='Actif'?'status active-status':'status paused-status'}>{s.status}</span></td><td><div className="actions"><Link title="Détails" to={`/app/etudiants/${s.id}`}><Eye size={17}/></Link><Link title="Modifier" to={`/app/etudiants/${s.id}/modifier`}><Pencil size={17}/></Link>{onDelete&&<button title="Supprimer" onClick={()=>onDelete(s.id)}><Trash2 size={17}/></button>}</div></td></tr>)}</tbody></table></div>
}
function StudentDetails() {
 const {id}=useParams(),{students}=useStore(),s=students.find(x=>x.id===Number(id))
 if(!s)return <NotFound/>
 return <><Link to="/app/etudiants" className="back-link"><ArrowLeft size={16}/> Retour à la liste</Link><div className="page-heading detail-heading"><div><span className="eyebrow">DOSSIER ÉTUDIANT</span><h1>{s.firstName} {s.lastName}</h1><p>Informations détaillées de l'étudiant.</p></div><Link className="btn btn-primary" to={`/app/etudiants/${s.id}/modifier`}><Pencil size={16}/> Modifier</Link></div><section className="panel detail-panel"><div className="detail-profile"><div className="big-avatar">{s.firstName[0]}{s.lastName[0]}</div><div><h2>{s.firstName} {s.lastName}</h2><span className={s.status==='Actif'?'status active-status':'status paused-status'}>{s.status}</span></div></div><div className="detail-grid"><Info label="Prénom" value={s.firstName}/><Info label="Nom" value={s.lastName}/><Info label="Adresse e-mail" value={s.email}/><Info label="Téléphone" value={s.phone||'—'}/><Info label="Filière" value={s.filiere}/><Info label="Niveau" value={s.level}/></div></section></>
}
function Info({label,value}){return <div className="info-item"><span>{label}</span><b>{value}</b></div>}
function StudentForm() {
 const {id}=useParams(),{students,setStudents}=useStore(),navigate=useNavigate(),editing=Boolean(id)
 const existing=students.find(s=>s.id===Number(id))
 const [form,setForm]=useState(existing||{firstName:'',lastName:'',email:'',phone:'',filiere:'Développement Digital',level:'1ère année',status:'Actif'})
 const [error,setError]=useState('')
 function change(e){setForm({...form,[e.target.name]:e.target.value})}
 function submit(e){e.preventDefault();if(!form.firstName.trim()||!form.lastName.trim()||!form.email.trim()){setError('Veuillez remplir le prénom, le nom et l’e-mail.');return}
 if(editing)setStudents(prev=>prev.map(s=>s.id===Number(id)?{...form,id:Number(id)}:s))
 else setStudents(prev=>[...prev,{...form,id:Math.max(0,...prev.map(s=>s.id))+1}])
 navigate('/app/etudiants')}
 if(editing&&!existing)return <NotFound/>
 return <><Link to="/app/etudiants" className="back-link"><ArrowLeft size={16}/> Retour à la liste</Link><div className="page-heading"><div><span className="eyebrow">DOSSIER ÉTUDIANT</span><h1>{editing?'Modifier un étudiant':'Ajouter un étudiant'}</h1><p>{editing?'Mettez à jour les informations du dossier.':'Remplissez les informations pour créer un nouveau dossier.'}</p></div></div><form className="panel form-panel" onSubmit={submit}><div className="form-grid"><label>Prénom *<input name="firstName" value={form.firstName} onChange={change} placeholder="Ex. Sara" required/></label><label>Nom *<input name="lastName" value={form.lastName} onChange={change} placeholder="Ex. Benali" required/></label><label>Adresse e-mail *<input type="email" name="email" value={form.email} onChange={change} placeholder="sara@example.com" required/></label><label>Téléphone<input name="phone" value={form.phone} onChange={change} placeholder="06XXXXXXXX"/></label><label>Filière<select name="filiere" value={form.filiere} onChange={change}><option>Développement Digital</option><option>Infrastructure Digitale</option><option>Gestion des Entreprises</option><option>Réseaux Informatiques</option><option>Comptabilité</option></select></label><label>Niveau<select name="level" value={form.level} onChange={change}><option>1ère année</option><option>2ème année</option><option>3ème année</option></select></label><label>Statut<select name="status" value={form.status} onChange={change}><option>Actif</option><option>En pause</option></select></label></div>{error&&<div className="error">{error}</div>}<div className="form-footer"><button type="button" className="btn btn-outline" onClick={()=>navigate('/app/etudiants')}>Annuler</button><button className="btn btn-primary">{editing?'Enregistrer les modifications':'Créer l’étudiant'} <span>→</span></button></div></form></>
}
function NotFound(){return <div className="not-found"><span>404</span><h1>Page introuvable</h1><p>La page demandée n'existe pas ou a été déplacée.</p><Link to="/" className="btn btn-primary">Retour à l'accueil</Link></div>}

export default App