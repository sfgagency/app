import React, { useState, useEffect } from 'react';
import { 
  Home, PlusSquare, MessageCircle, User, Heart, Share2, 
  Music2, Search, Send, Disc, ArrowLeft, Settings, 
  Shield, LogOut, Loader2, Music, Upload, Mail, Lock, Radio
} from 'lucide-react';

/**
 * SFG - Sound of Germany
 * Cloudflare D1 Integration via Worker
 * API Endpoint: https://sfg.j-gutschein2.workers.dev
 * * Verifizierte Accounts:
 * - info@sfg.de
 * - ryanjamie.herrmann@gmail.com
 */

const API_URL = 'https://sfg.j-gutschein2.workers.dev';

// Liste der verifizierten E-Mails
const VERIFIED_EMAILS = ['info@sfg.de', 'ryanjamie.herrmann@gmail.com'];

export default function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  const [posts, setPosts] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('sfg_cf_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchPosts();
    setLoading(false);
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (err) {
      console.warn("Verbindung zum Cloudflare Worker wird geprüft...");
      const local = JSON.parse(localStorage.getItem('sfg_cf_posts') || '[]');
      setPosts(local);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = authMode === 'register' ? '/api/register' : '/api/login';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username })
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('sfg_cf_user', JSON.stringify(userData));
      } else {
        const mockUser = { 
          uid: 'u_' + Date.now(), 
          email, 
          username: username || email.split('@')[0],
          isVerified: VERIFIED_EMAILS.includes(email.toLowerCase())
        };
        setUser(mockUser);
        localStorage.setItem('sfg_cf_user', JSON.stringify(mockUser));
      }
    } catch (err) {
      const mockUser = { 
        uid: 'local_' + Date.now(), 
        email, 
        username: username || email.split('@')[0],
        isVerified: VERIFIED_EMAILS.includes(email.toLowerCase())
      };
      setUser(mockUser);
    }
    setLoading(false);
  };

  const handleUpload = async () => {
    if (!uploadTitle.trim() || !user) return;
    setIsUploading(true);

    const newPost = {
      uid: user.uid,
      username: user.username,
      songTitle: uploadTitle,
      description: uploadDesc,
      likes: 0,
      media: 'from-orange-600 to-red-900',
      createdAt: Date.now(),
      userEmail: user.email // Wichtig für die Verifizierung im Feed
    };

    try {
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      
      if (response.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error("Cloudflare Sync fehlgeschlagen.");
    }

    const updatedPosts = [{ id: 'temp_' + Date.now(), ...newPost }, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('sfg_cf_posts', JSON.stringify(updatedPosts));
    
    setUploadTitle('');
    setUploadDesc('');
    setIsUploading(false);
    setActiveTab('home');
  };

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white">
      <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
      <p className="font-black tracking-widest uppercase text-xs">SFG x D1 Sync</p>
    </div>
  );

  if (!user) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center p-8 text-white">
        <div className="mb-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-600 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/20 mx-auto mb-6">
            <Radio size={48} className="text-black" />
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter">SFG</h1>
          <p className="text-orange-500 text-[10px] font-bold tracking-[0.5em] uppercase mt-2">Sound of Germany</p>
        </div>

        <form onSubmit={handleAuth} className="w-full max-w-sm space-y-4">
          {authMode === 'register' && (
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-500" size={20} />
              <input 
                className="w-full bg-gray-900 border border-gray-800 p-4 pl-12 rounded-2xl outline-none focus:border-orange-500 transition-all"
                placeholder="Künstlername" value={username} onChange={e => setUsername(e.target.value)} required 
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-500" size={20} />
            <input 
              className="w-full bg-gray-900 border border-gray-800 p-4 pl-12 rounded-2xl outline-none focus:border-orange-500 transition-all"
              type="email" placeholder="E-Mail" value={email} onChange={e => setEmail(e.target.value)} required 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-500" size={20} />
            <input 
              className="w-full bg-gray-900 border border-gray-800 p-4 pl-12 rounded-2xl outline-none focus:border-orange-500 transition-all"
              type="password" placeholder="Passwort" value={password} onChange={e => setPassword(e.target.value)} required 
            />
          </div>
          
          <button className="w-full bg-orange-500 text-black p-5 rounded-2xl font-black text-xl active:scale-95 transition-transform shadow-xl shadow-orange-500/20">
            {authMode === 'login' ? 'LOGIN' : 'STARTEN'}
          </button>
        </form>

        <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="mt-10 text-gray-500 text-xs font-bold uppercase tracking-widest">
          {authMode === 'login' ? 'Account erstellen' : 'Zum Login'}
        </button>
      </div>
    );
  }

  // Prüfen, ob der aktuelle Benutzer verifiziert ist
  const isUserVerified = VERIFIED_EMAILS.includes(user.email?.toLowerCase());

  return (
    <div className="h-screen bg-black text-white flex flex-col max-w-md mx-auto relative overflow-hidden">
      
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {activeTab === 'home' && (
          <div className="h-full snap-y snap-mandatory overflow-y-scroll">
            {posts.length > 0 ? (
              posts.map(post => <FeedPost key={post.id} post={post} />)
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-700">
                <Music2 size={64} className="mb-4 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-xs italic">Warte auf Sound...</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="p-8 space-y-6">
            <h2 className="text-4xl font-black italic tracking-tighter">NEUER TRACK</h2>
            <div className="bg-gray-900/50 border-2 border-dashed border-gray-800 rounded-3xl h-56 flex flex-col items-center justify-center text-gray-500">
              <Upload size={48} className="mb-2 text-orange-500" />
              <p className="font-black text-[10px] uppercase tracking-widest">Video Datei</p>
            </div>
            <input 
              className="w-full bg-gray-900 p-5 rounded-2xl outline-none border border-gray-800 focus:border-orange-500"
              placeholder="Track Titel" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)}
            />
            <textarea 
              className="w-full bg-gray-900 p-5 rounded-2xl outline-none border border-gray-800 h-28 resize-none focus:border-orange-500"
              placeholder="Beschreibung..." value={uploadDesc} onChange={e => setUploadDesc(e.target.value)}
            />
            <button onClick={handleUpload} disabled={isUploading} className="w-full bg-orange-500 text-black py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3">
              {isUploading ? <Loader2 className="animate-spin" /> : 'POSTEN'}
            </button>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-8 text-center">
             <div className="w-32 h-32 rounded-[2.5rem] mx-auto mb-6 bg-gray-900 flex items-center justify-center border-2 border-orange-500 shadow-2xl p-1">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="Profile" className="rounded-[2.3rem]" />
             </div>
             <h2 className="text-3xl font-black italic tracking-tighter uppercase flex items-center justify-center gap-2">
               @{user.username} 
               {isUserVerified && <Shield size={20} className="text-blue-500 fill-blue-500/20" />}
             </h2>
             <p className="text-orange-500 text-[10px] font-black mt-2 tracking-widest uppercase bg-orange-500/10 px-4 py-1 rounded-full inline-block">
               {isUserVerified ? 'Official Partner' : 'Artist'}
             </p>
             
             <div className="grid grid-cols-2 gap-4 mt-10">
                <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800">
                   <p className="text-2xl font-black">{posts.filter(p => p.uid === user.uid).length}</p>
                   <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Tracks</p>
                </div>
                <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800">
                   <p className="text-2xl font-black">{isUserVerified ? '1.2k' : '0'}</p>
                   <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Fans</p>
                </div>
             </div>

             <button onClick={() => { localStorage.clear(); setUser(null); }} className="mt-20 text-gray-600 flex items-center gap-2 mx-auto uppercase text-[10px] font-black tracking-widest">
               <LogOut size={16}/> Logout
             </button>
          </div>
        )}
      </div>

      <div className="h-28 bg-black/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-8 pb-8 pt-2">
        <NavBtn icon={Home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavBtn icon={Search} active={activeTab === 'search'} onClick={() => setActiveTab('search')} />
        <button onClick={() => setActiveTab('upload')} className="bg-orange-500 p-5 rounded-2xl -mt-12 shadow-2xl shadow-orange-500/40 active:scale-90 transition-transform border-4 border-black">
          <PlusSquare size={26} className="text-black" />
        </button>
        <NavBtn icon={MessageCircle} active={activeTab === 'inbox'} onClick={() => setActiveTab('inbox')} />
        <NavBtn icon={User} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </div>
    </div>
  );
}

function NavBtn({ icon: Icon, active, onClick }) {
  return (
    <button onClick={onClick} className={`transition-all ${active ? 'text-orange-500 scale-125' : 'text-gray-600'}`}>
      <Icon size={26} strokeWidth={active ? 3 : 2} />
    </button>
  );
}

function FeedPost({ post }) {
  // Prüfen, ob der Autor des Posts verifiziert ist
  const isVerifiedPost = post.userEmail && VERIFIED_EMAILS.includes(post.userEmail.toLowerCase());

  return (
    <div className="h-full w-full snap-start relative bg-black flex items-center justify-center overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${post.media || 'from-orange-900/20 to-black'} opacity-40`}></div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
         <Disc size={300} className="animate-spin-slow" />
      </div>
      <div className="absolute right-6 bottom-36 flex flex-col gap-8 items-center z-10">
        <div className="w-12 h-12 rounded-2xl border-2 border-orange-500 shadow-xl overflow-hidden bg-black relative">
           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.username}`} alt="A" />
           {isVerifiedPost && (
             <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border border-black">
               <Shield size={10} className="text-white fill-white" />
             </div>
           )}
        </div>
        <div className="flex flex-col items-center gap-1"><Heart size={38} className="drop-shadow-lg"/><span className="text-[10px] font-black">{post.likes}</span></div>
        <MessageCircle size={38} className="drop-shadow-lg" />
        <Share2 size={38} className="drop-shadow-lg" />
      </div>
      <div className="absolute bottom-8 left-8 right-24 z-10">
        <h3 className="font-black text-3xl italic tracking-tighter flex items-center gap-2">
          @{post.username} 
          {isVerifiedPost && <Shield size={18} className="text-blue-500 fill-blue-500/20" />}
        </h3>
        <p className="text-sm text-gray-300 mt-2 font-medium line-clamp-2">{post.description}</p>
        <div className="flex items-center gap-3 mt-6 bg-white/5 backdrop-blur-md p-3 px-5 rounded-2xl border border-white/10 w-fit">
          <Music2 size={16} className="text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[150px]">{post.songTitle}</span>
        </div>
      </div>
    </div>
  );
}

const style = document.createElement('style');
style.innerHTML = `
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .animate-spin-slow { animation: spin-slow 15s linear infinite; }
`;
document.head.appendChild(style);