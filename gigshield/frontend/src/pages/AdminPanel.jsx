import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminPanel() {
  const [city, setCity] = useState("Delhi");
  const [triggerType, setTriggerType] = useState("aqi");
  const [triggerValue, setTriggerValue] = useState(318);
  const [isFiring, setIsFiring] = useState(false);
  const [status, setStatus] = useState("Ready for Intelligence Injection");
  const [lastMsg, setLastMsg] = useState({ type: '', text: '' });

  const triggerOptions = [
    { id: 'aqi', label: 'Air Quality', icon: '🌫️', default: 320, units: 'AQI' },
    { id: 'rainfall', label: 'Heavy Rain', icon: '🌧️', default: 15.5, units: 'mm/h' },
    { id: 'heat', label: 'Heatwave', icon: '🔥', default: 46.2, units: '°C' },
    { id: 'wind', label: 'Cyclone', icon: '💨', default: 55, units: 'km/h' },
  ];

  const handleSimulate = async () => {
    setIsFiring(true);
    setStatus("Broadcasting Trigger Event to Regional Nodes...");
    setLastMsg({ type: '', text: '' });
    
    try {
      const res = await axios.post('/api/admin/trigger/simulate', {
        city,
        trigger_type: triggerType,
        trigger_value: parseFloat(triggerValue),
        calamity_mode: true
      });
      setLastMsg({ type: 'success', text: "Operation Authorized: Trigger Propagated ✅" });
      setStatus(`Success: Event ${res.data.trigger_event_id.slice(0,8)}... generated.`);
    } catch (err) {
      setLastMsg({ type: 'error', text: "Transmission Rejected by Security Kernel ❌" });
      setStatus("Error: Authorization Failure.");
    } finally {
      setIsFiring(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      
      {/* HUD Header */}
      <div className="flex justify-between items-center bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
            Strategic <span className="text-blue-500 text-glow">Command</span> Center
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Root Authority Active
          </p>
        </div>
        <div className="text-right hidden md:block">
           {lastMsg.text && (
             <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border animate-in slide-in-from-right-4 ${
               lastMsg.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
             }`}>
               {lastMsg.text}
             </span>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Trigger Console */}
        <div className="lg:col-span-2 space-y-6">
           <div className="glass-card !p-8 relative overflow-hidden">
             <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>
             
             <h2 className="text-xl font-black text-white uppercase tracking-tight mb-8 flex items-center gap-3">
               <span className="p-2 bg-blue-500/20 rounded-xl text-blue-500 text-sm">📡</span> Trigger Injection Matrix
             </h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div>
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Target Sector</label>
                     <div className="grid grid-cols-3 gap-2">
                        {['Delhi', 'Mumbai', 'Hyderabad', 'Chennai', 'Kolkata'].map(c => (
                          <button key={c} onClick={() => setCity(c)}
                            className={`py-3 rounded-2xl text-[11px] font-black uppercase transition-all ${
                              city === c ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}>{c}</button>
                        ))}
                     </div>
                   </div>

                   <div>
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Environmental Parameter</label>
                     <div className="grid grid-cols-2 gap-2">
                        {triggerOptions.map(opt => (
                          <button key={opt.id} onClick={() => { setTriggerType(opt.id); setTriggerValue(opt.default); }}
                            className={`flex items-center gap-3 p-4 rounded-3xl border transition-all ${
                              triggerType === opt.id ? 'bg-white/10 border-blue-500/50 text-white' : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'
                            }`}>
                            <span className="text-2xl">{opt.icon}</span>
                            <span className="text-[10px] font-black uppercase">{opt.label}</span>
                          </button>
                        ))}
                     </div>
                   </div>
                </div>

                <div className="flex flex-col justify-between">
                   <div className="p-6 bg-slate-900/50 rounded-3xl border border-white/5 relative group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Payload Intensity</label>
                      <div className="flex items-end gap-3 justify-center mb-6">
                         <input type="number" step="any" value={triggerValue} onChange={e => setTriggerValue(e.target.value)}
                           className="bg-transparent text-5xl font-black text-white w-32 border-b-4 border-blue-500/20 focus:border-blue-500 outline-none transition-all text-center"/>
                         <span className="text-xl font-black text-slate-600 uppercase mb-2">{triggerOptions.find(o => o.id === triggerType)?.units}</span>
                      </div>
                      <p className="text-[9px] text-slate-500 text-center uppercase font-bold tracking-widest leading-relaxed">
                        This value overrides baseline regional sensors to simulate a catastrophic event for all {city} riders.
                      </p>
                   </div>

                   <button onClick={handleSimulate} disabled={isFiring}
                     className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-xs transition-all shadow-2xl relative overflow-hidden group ${
                       isFiring ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/40'
                     }`}>
                     <span className="relative z-10">{isFiring ? 'Broadcasting...' : 'ENGAGE GLOBAL TRIGGER 🚨'}</span>
                     {!isFiring && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>}
                   </button>
                </div>
             </div>

             <div className="mt-8 p-4 bg-black/40 rounded-2xl border border-white/5 font-mono text-[10px] flex items-center gap-3">
                <span className="text-green-500">{'>'}</span>
                <span className="text-slate-400">{status}</span>
             </div>
           </div>
        </div>

        {/* Live Surveillance Feed */}
        <div className="lg:col-span-1 space-y-6">
           <div className="glass-card !p-6 h-full border-amber-500/10 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
             <h2 className="text-md font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
               <span className="p-2 bg-amber-500/20 rounded-xl text-amber-500 text-sm">👁️</span> Fraud Surveillance
             </h2>

             <div className="space-y-4">
                {[
                  { id: 'ZMT-922', user: 'Anil Kumar', risk: 'HIGH', reason: 'Zero Jitter SPOOF', icon: '📍' },
                  { id: 'SWG-115', user: 'Priya S.', risk: 'CRITICAL', reason: 'Velocity Anomaly', icon: '⚡' },
                  { id: 'ZMT-042', user: 'David M.', risk: 'CLEAN', reason: 'Verified Trajectory', icon: '✅' },
                ].map(item => (
                  <div key={item.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase">{item.id}</span>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${
                          item.risk === 'CLEAN' ? 'bg-green-500/10 text-green-400' : 'bg-rose-500/10 text-rose-500'
                        }`}>{item.risk}</span>
                     </div>
                     <p className="text-xs font-bold text-white mb-1">{item.user}</p>
                     <p className="text-[9px] text-slate-500 uppercase font-black flex items-center gap-2">
                        <span className="opacity-50">{item.icon}</span> {item.reason}
                     </p>
                  </div>
                ))}
             </div>

             <div className="mt-8">
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all">
                  Open Advanced Ledger →
                </button>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
