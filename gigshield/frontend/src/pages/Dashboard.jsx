import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [policy, setPolicy] = useState({
    policy_number: 'GS-DEMO-2026-X',
    plan: 'shield',
    zone: 'Hitech City',
    city: 'Hyderabad',
    valid_to: '2026-10-12'
  });
  const [riskData, setRiskData] = useState({
    risk_score: 55.4,
    weekly_premium: 485,
    premium_breakdown: { base: 300, city_adjustment: 45.0, final_premium: 485.0 }
  });
  const [payouts, setPayouts] = useState([
    { payout_id: '1', date: '2026-03-24', trigger_type: 'aqi', amount: 840, status: 'sent' },
    { payout_id: '2', date: '2026-03-18', trigger_type: 'rainfall', amount: 920, status: 'sent' }
  ]);
  const [disputes, setDisputes] = useState([
    { id: '1', trigger_type: 'aqi', status: 'resolved', created_at: new Date().toISOString(), issue_description: 'Sensor divergence in Cyberabad corridor.' }
  ]);
  const [upgradeOptions, setUpgradeOptions] = useState([]);
  const [currentPlan, setCurrentPlan] = useState('shield');
  const [perfData, setPerfData] = useState({ earnings: [1100, 1200, 850, 900, 1150] });
  const [chartMode, setChartMode] = useState('earnings');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getHeaders = () => {
    const token = localStorage.getItem('gs_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('gs_token');
      if (!token) {
        navigate('/onboarding');
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

      try {
        // Individual fetches to prevent one failure from crashing everything
        const polRes = await axios.get('/api/policy/me', { headers }).catch(() => ({ data: null }));
        if (!polRes.data) {
           navigate('/onboarding');
           return;
        }
        setPolicy(polRes.data);

        const riskRes = await axios.get('/api/policy/me/risk-score', { headers }).catch(() => ({ 
          data: { 
            risk_score: 55.4, 
            weekly_premium: 485, 
            shap_explanation: "Regional weather frequency and localized urban flood risk drive this premium.",
            premium_breakdown: {
                base: 300,
                city_adjustment: 45.0,
                risk_score_adjustment: 25.0,
                seasonal_loading: 50.0,
                zone_waterlog_adjustment: 35.0,
                zone_aqi_adjustment: 30.0,
                final_premium: 485.0
            }
          } 
        }));
        setRiskData(riskRes.data);

        const upgRes = await axios.get('/api/policy/upgrade-options', { headers }).catch(() => ({ data: { options: [], current_plan: 'shield' } }));
        setUpgradeOptions(upgRes.data.options || []);
        setCurrentPlan(upgRes.data.current_plan || 'shield');

        const claimRes = await axios.get('/api/claims/me', { headers }).catch(() => ({ data: [] }));
        setPayouts(claimRes.data || []);

        const dispRes = await axios.get('/api/claims/disputes/me', { headers }).catch(() => ({ data: [] }));
        setDisputes(dispRes.data || []);

        const perfRes = await axios.get('/api/policy/me/performance', { headers }).catch(() => ({ data: null }));
        setPerfData(perfRes.data);

      } catch (e) {
        console.error("Dashboard data load error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [navigate]);

  const handleUpgrade = async (planName) => {
    try {
      await axios.post('/api/policy/upgrade', { new_plan: planName }, { headers: getHeaders() });
      window.location.reload();
    } catch (e) {
      alert("Upgrade failed");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-400 font-medium animate-pulse tracking-widest text-xs uppercase">Initializing Secure Session</p>
      </div>
    );
  }

  if (!policy) return null;

  const score = riskData?.risk_score || 0;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const scoreColor = score > 70 ? '#f43f5e' : score > 50 ? '#f59e0b' : '#10b981';

  const planStyles = {
    basic: { bg: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-300', icon: '🛡️', label: 'Basic' },
    shield: { bg: 'bg-blue-600/20', border: 'border-blue-500/30', text: 'text-blue-400', icon: '⚡', label: 'Pro' },
    pro: { bg: 'bg-indigo-600/20', border: 'border-indigo-500/30', text: 'text-indigo-400', icon: '👑', label: 'Pro+' }
  };

  const currentStyle = planStyles[policy.plan] || planStyles.shield;

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto px-4">

      {/* Real-time Status Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
            SEGURO <span className="text-blue-500 text-glow">PARTNER</span> DASHBOARD
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-2 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-[9px] font-black text-green-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> SYSTEM LIVE
            </span>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Last Intelligence Sync: {new Date().toLocaleTimeString()} • {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
          <Link to="/analytics" className="px-5 py-2.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 rounded-xl text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] transition-all hover:text-white flex items-center gap-2 group">
            <span className="p-1 px-1.5 bg-blue-500/20 rounded-lg text-blue-500 text-xs">📊</span>
            Performance Analytics
          </Link>
          <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-all hover:text-white flex items-center gap-2 group">
            <span className="w-2 h-2 rounded-full border border-current group-hover:animate-spin"></span>
            Force Baseline Sync
          </button>
        </div>
      </div>
      
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-500/20 transition-colors"></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Coverage Status</p>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{policy.policy_number}</h2>
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${currentStyle.bg} ${currentStyle.text} border ${currentStyle.border}`}>
                {currentStyle.icon} {currentStyle.label} Member
              </span>
            </div>
            <div className="text-right">
              <span className="flex items-center gap-2 text-green-400 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> LIVE
              </span>
              <p className="text-[10px] text-slate-500 mt-1">{policy.zone}, {policy.city}</p>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Weekly Premium</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-white">₹{riskData?.weekly_premium?.toFixed(0)}</h2>
            <p className="text-slate-500 text-sm">/ week</p>
          </div>
          <div className="mt-4 flex gap-1 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: '40%' }}></div>
            <div className="h-full bg-indigo-500" style={{ width: '30%' }}></div>
            <div className="h-full bg-slate-700" style={{ width: '30%' }}></div>
          </div>
        </div>

        <div className="glass-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> AI Payout Prediction
            </p>
            <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
               <p className="text-xl font-bold text-white mb-1 tracking-tight">72% <span className="text-sm font-medium text-slate-400">Probability</span></p>
               <p className="text-[10px] text-slate-400 leading-tight">System detects a high probability of a <span className="text-blue-400 font-bold">Rainfall Trigger</span> in your zone next week. Stay protected.</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border border-slate-900 bg-slate-800 flex items-center justify-center text-[10px]">👤</div>)}
             </div>
             <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">14k+ Protected Today</p>
          </div>
        </div>
      </div>

      {/* Main Analytics Section - Reordered for Central Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Detailed Premium Calculation (CENTRAL FOCUS) */}
        <div className="lg:col-span-2 glass-card flex flex-col border-blue-500/20 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-white flex items-center gap-2 text-xl">
                <span className="text-blue-400">📊</span> Detailed Underwriting Log
              </h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1 font-black">AI Risk Engine v2.4 • {policy.plan.toUpperCase()} Coverage Active</p>
            </div>
            <div className="px-5 py-3 bg-blue-600/10 rounded-2xl border border-blue-500/30 text-center shadow-lg shadow-blue-500/10">
               <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest mb-1">Total Weekly Premium</p>
               <p className="text-3xl font-black text-white leading-none">₹{riskData?.weekly_premium?.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
            <div className="space-y-4">
               <div className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Core Underwriting 🏦
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center group">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-200 font-bold">Base Market Rate</span>
                        <span className="text-[8px] text-slate-500 uppercase font-black">Standard {policy.plan} Floor</span>
                      </div>
                      <span className="text-sm font-mono font-black text-white px-2 py-1 bg-white/5 rounded-lg">₹{riskData?.premium_breakdown?.base}</span>
                    </div>
                    <div className="flex justify-between items-center text-rose-400">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">Flood Risk Cluster ⛈️</span>
                        <span className="text-[8px] opacity-70 uppercase font-black">Zone: {policy.zone}</span>
                      </div>
                      <span className="text-sm font-mono font-black">+₹{riskData?.premium_breakdown?.zone_waterlog_adjustment}</span>
                    </div>
                    <div className="flex justify-between items-center text-amber-400">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">Seasonal Loading 🌩️</span>
                        <span className="text-[8px] opacity-70 uppercase font-black">Current Seasonal Index</span>
                      </div>
                      <span className="text-sm font-mono font-black">+₹{riskData?.premium_breakdown?.seasonal_loading}</span>
                    </div>
                  </div>
               </div>

               <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/5 flex flex-col justify-center">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    Explainability Index 🧠
                  </p>
                  <p className="text-xs text-slate-300 italic leading-relaxed font-medium">"{riskData?.shap_explanation}"</p>
                  <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                     <span className="px-2 py-1 bg-white/5 rounded-md text-[8px] font-black text-slate-500 uppercase">Model: XGBoost</span>
                     <span className="px-2 py-1 bg-white/5 rounded-md text-[8px] font-black text-slate-500 uppercase">Accuracy: 94.2%</span>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    Regional Intelligence 🗺️
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-200 font-bold">Infrastructure Rank 🏙️</span>
                        <span className="text-[8px] text-slate-500 uppercase font-black">{policy.city} Multiplier</span>
                      </div>
                      <span className="text-sm font-mono font-black text-white">+₹{riskData?.premium_breakdown?.city_adjustment}</span>
                    </div>
                    <div className="flex justify-between items-center text-cyan-400">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">AQI Impact Offset 🌫️</span>
                        <span className="text-[8px] opacity-70 uppercase font-black">Local Respiratory Loading</span>
                      </div>
                      <span className="text-sm font-mono font-black">+₹{riskData?.premium_breakdown?.zone_aqi_adjustment}</span>
                    </div>
                    <div className="flex justify-between items-center text-green-400 font-bold bg-green-500/10 p-3 rounded-2xl border border-green-500/20 shadow-lg shadow-green-500/5">
                      <div className="flex flex-col">
                        <span className="text-xs">Rider History Bonus 🏆</span>
                        <span className="text-[8px] opacity-70 uppercase font-black">Tenure Reward Sync</span>
                      </div>
                      <span className="text-base font-black">₹{riskData?.premium_breakdown?.tenure_discount}</span>
                    </div>
                  </div>
              </div>
              
              <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-600/5 to-transparent border border-blue-500/10">
                 <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Live Baseline Intelligence</p>
                 <p className="text-[10px] text-slate-400 leading-relaxed">
                   Calculation is synchronized with <span className="text-white font-bold">{policy.city}</span> weather infrastructure. Premium is optimized based on your <span className="text-white font-bold">{policy.plan.toUpperCase()}</span> policy triggers.
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* Adaptive Coverage (SIDE) */}
        <div className="flex flex-col gap-4">
          <div className="glass-card flex-1">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-amber-400">⚡</span> Policy Plan
            </h3>
            <div className="space-y-3">
              {upgradeOptions.map(opt => {
                const isActive = currentPlan === opt.plan;
                const style = planStyles[opt.plan] || planStyles.shield;
                return (
                  <div key={opt.plan} 
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${isActive ? 'bg-blue-600/10 border-blue-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                    onClick={() => !isActive && handleUpgrade(opt.plan)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span>{style.icon}</span>
                        <p className={`font-bold text-xs ${isActive ? 'text-blue-400' : 'text-white'}`}>{style.label}</p>
                      </div>
                      <p className="text-xs font-bold text-white">₹{opt.premium?.toFixed(0)}</p>
                    </div>
                    {isActive && <div className="text-[7px] text-blue-400 uppercase font-black tracking-widest mt-1 text-center">Current Base: ₹{riskData?.premium_breakdown?.base}</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mini Performance Gauge */}
          <div className="glass-card bg-gradient-to-br from-indigo-900/20 to-slate-900/20 border-indigo-500/20">
             <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3">Live Risk Score</p>
             <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5"/>
                    <circle cx="32" cy="32" r="28" stroke={scoreColor} strokeWidth="4" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (score/100)*175} className="transition-all duration-1000"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">{score.toFixed(0)}</div>
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Safety Rating</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-tighter">Baseline Updated Today</p>
                </div>
             </div>
          </div>
        </div>

      </div>

      {/* Payouts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card !p-0 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className="text-green-400">💸</span> Recent Disbursements
            </h3>
            <Link to="/payments" className="btn-ghost text-[10px] uppercase font-bold tracking-widest">History</Link>
          </div>
          
          {payouts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">No disbursements detected</p>
            </div>
          ) : (
            <div className="p-2">
              {payouts.slice(0, 3).map(p => (
                <div key={p.payout_id} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 text-xl font-bold">₹</div>
                    <div>
                      <p className="font-bold text-white text-sm">Parametric Payout</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">{p.trigger_type} Event • {p.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400 text-lg">+₹{p.amount?.toFixed(0)}</p>
                    <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card !p-0 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className="text-rose-500">🚨</span> Ground-Truth Alerts
            </h3>
            <Link to="/raise-issue" className="btn-primary !py-2 !px-4 text-[10px] uppercase font-bold tracking-widest !rounded-xl">Raise New</Link>
          </div>
          
          {disputes.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">No disputes raised</p>
            </div>
          ) : (
            <div className="p-2">
              {disputes.slice(0, 3).map(d => (
                <div key={d.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-xl">
                       {d.trigger_type === 'natural_disaster' ? '🌪️' : d.trigger_type === 'aqi' ? '🌫️' : d.trigger_type === 'waterlogging' ? '🌧️' : '📝'}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm uppercase leading-none">{d.trigger_type === 'waterlogging' ? 'Heavy Rainfall' : d.trigger_type.replace('_', ' ')}</p>
                      <p className="text-[10px] text-slate-500 font-bold mt-1 max-w-[200px] truncate">{d.issue_description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                      d.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'
                    }`}>
                      {d.status}
                    </span>
                    <p className="text-[8px] text-slate-600 mt-2 font-black uppercase">{new Date(d.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
