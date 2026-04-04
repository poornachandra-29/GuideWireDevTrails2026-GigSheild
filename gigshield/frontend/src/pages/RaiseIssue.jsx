import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function RaiseIssue() {
  const [triggerType, setTriggerType] = useState('aqi');
  const [isFakeData, setIsFakeData] = useState(false);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liveWeather, setLiveWeather] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchWeather() {
      try {
        const token = localStorage.getItem('gs_token');
        if (!token) return;
        const res = await axios.get('/api/triggers/latest', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => null);
        if (res && res.data) setLiveWeather(res.data);
      } catch (e) {}
    }
    fetchWeather();
  }, []);

  const validateDispute = () => {
    if (!liveWeather || liveWeather.aqi === 'N/A' || liveWeather.aqi === 'API_ERR') return true;
    let warnings = [];
    
    // AQI Logic
    if (triggerType === 'aqi' && !isNaN(Number(liveWeather.aqi)) && Number(liveWeather.aqi) < 100) {
      warnings.push(`Current AQI is stable (${liveWeather.aqi}). System shows clean air.`);
    }

    // RAINFALL Logic (New)
    const rainVal = liveWeather.rain_mm === 'N/A' ? 0 : Number(liveWeather.rain_mm);
    if (triggerType === 'waterlogging' && rainVal < 1.0) {
      warnings.push(`Local nodes report zero or negligible precipitation (${rainVal}mm). Raising a rainfall dispute may be flagged as inaccurate.`);
    }

    if (warnings.length > 0) {
      setWarningMsg(warnings.join(' '));
      setShowWarning(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) { alert('Description required.'); return; }
    if (!showWarning && !validateDispute()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('gs_token');
      await axios.post('/api/claims/dispute', {
        trigger_type: triggerType,
        is_fake_data: isFakeData,
        issue_description: description
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSubmitted(true);
    } catch (e) {
      alert("Submission failed.");
    } finally {
      setLoading(false);
      setShowWarning(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 animate-in fade-in zoom-in duration-500 px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center text-5xl border border-green-500/20 shadow-[0_0_50px_-10px_rgba(34,197,94,0.4)]">✅</div>
        <h2 className="text-3xl font-black text-white tracking-widest uppercase">Issue Logged</h2>
        <p className="text-slate-400 text-sm max-w-md">Your dispute has been transmitted to AI review console. Adjustments will reflect in payouts if validated.</p>
        <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition shadow-xl shadow-blue-500/20">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-4 py-6">
      {/* Header Bar */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
            Rider <span className="text-rose-500">Concierge</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Ground-Truth Evidence Engine</p>
        </div>
        <Link to="/dashboard" className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all">
          ← Main Console
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         
         {/* LEFT RIBBON: Live Sensor Sync */}
         <div className="lg:col-span-1 space-y-4">
            <div className="glass-card border-blue-500/20">
               <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Intelligence Sync
               </p>
               <div className="space-y-4">
                  {[
                    { l: 'AQI Level', v: liveWeather?.aqi, i: '🌫️' },
                    { l: 'Rainfall', v: liveWeather?.rain_mm, i: '🌊' },
                    { l: 'Temp', v: liveWeather?.temp, i: '🔥' },
                    { l: 'Wind', v: liveWeather?.wind_kmph, i: '💨' }
                  ].map(s => (
                    <div key={s.l} className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                       <span className="text-2xl">{s.i}</span>
                       <div className="flex-1">
                          <p className="text-[10px] font-bold text-white leading-none">{s.v || 'Sync...'}</p>
                          <p className="text-[8px] text-slate-500 uppercase font-black mt-1 leading-none">{s.l}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="mt-6 pt-4 border-t border-white/5">
                  <p className="text-[9px] text-slate-500 italic leading-snug">📍 Local Node: {liveWeather?.city}</p>
                  <p className="text-[8px] text-slate-600 uppercase font-black mt-1">Source: {liveWeather?.source}</p>
               </div>
            </div>

            <div className="glass-card bg-rose-500/5 border-rose-500/10">
               <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2 px-2 py-1 bg-rose-500/10 rounded-lg inline-block">Integrity Warning ⚠️</p>
               <p className="text-[10px] text-slate-400 leading-relaxed mt-2">Dispute fidelity is tracked weekly. High inaccuracy scores will affect payout prioritization.</p>
            </div>
         </div>

         {/* MAIN WORK AREA */}
         <div className="lg:col-span-3 space-y-6">
            <div className="glass-card !p-8">
               <form onSubmit={handleSubmit} className="space-y-8">
                 <div>
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">1. Parameter Mismatch Selection</p>
                   <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                     {[
                       { val: 'aqi', label: 'AQI', icon: '🌫️' },
                       { val: 'waterlogging', label: 'Heavy Rainfall', icon: '🌧️' },
                       { val: 'heatwave', label: 'Heat', icon: '🔥' },
                       { val: 'natural_disaster', label: 'Disaster', icon: '🌪️' },
                       { val: 'others', label: 'Others', icon: '📝' },
                     ].map(opt => (
                       <button type="button" key={opt.val}
                         onClick={() => { setTriggerType(opt.val); setShowWarning(false); }}
                         className={`p-4 rounded-3xl border transition-all flex flex-col items-center gap-2 ${
                           triggerType === opt.val
                             ? `bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500/30`
                             : 'bg-white/5 border-white/5 hover:bg-white/10'
                         }`}>
                         <span className="text-3xl">{opt.icon}</span>
                         <span className="text-[10px] font-black uppercase text-center text-slate-400">{opt.label}</span>
                       </button>
                     ))}
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">2. Evidence Detail</p>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows="5"
                          className="w-full bg-slate-900/40 border border-white/10 rounded-3xl p-5 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
                          placeholder="Describe the divergence... e.g. 'Station reports clear but zone is currently flooded.'"/>
                    </div>
                    <div className="flex flex-col justify-between">
                        <div className="space-y-4">
                           <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">3. System Flags</p>
                           <div className={`p-5 rounded-3xl border transition-all cursor-pointer ${isFakeData ? 'bg-rose-500/10 border-rose-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                             <label className="flex items-center gap-4 cursor-pointer">
                               <input type="checkbox" checked={isFakeData} onChange={e => setIsFakeData(e.target.checked)} className="w-5 h-5 accent-rose-500 rounded-lg"/>
                               <div>
                                 <p className="text-[11px] font-black text-white uppercase tracking-wider">Fabricated Data Log ⚠️</p>
                                 <p className="text-[10px] text-slate-500 leading-tight mt-1">This sensor report is factually impossible.</p>
                               </div>
                             </label>
                           </div>
                        </div>

                        {showWarning ? (
                          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-3xl mt-4">
                            <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">⚠️ Conflict Detected</p>
                            <p className="text-[10px] text-slate-300 mb-4">{warningMsg}</p>
                            <div className="flex gap-2">
                               <button type="submit" className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase rounded-2xl transition">Submit Anyway</button>
                               <button type="button" onClick={() => setShowWarning(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-400 text-[10px] font-black uppercase rounded-2xl border border-white/10 transition">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <button type="submit" disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-rose-600 to-rose-700 disabled:from-rose-900/50 text-white font-black uppercase tracking-[0.3em] text-xs rounded-3xl transition shadow-2xl shadow-rose-900/20 mt-4 group">
                            {loading ? 'Transmitting...' : 'Transmit Dispute Console 🚨'}
                          </button>
                        )}
                    </div>
                 </div>
               </form>
            </div>
         </div>

      </div>
    </div>
  );
}
