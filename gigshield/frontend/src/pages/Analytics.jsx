import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Analytics() {
  const [stats] = useState({
    totalClaims: 12,
    reliability: 98.4,
    payoutRate: 100,
    activeWeeks: 48,
    totalDisbursed: 14250,
    riskLevel: 'LOW'
  });

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none flex items-center gap-4">
            Rider <span className="text-cyan-400 underline decoration-cyan-500/30 underline-offset-8">Intelligence</span> Matrix
          </h1>
          <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.5em] mt-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span> Advanced Performance Analytics & Seasonal Risk Calibration
          </p>
        </div>
        <Link to="/dashboard" className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[11px] font-black text-slate-300 uppercase tracking-widest transition-all shadow-xl hover:shadow-cyan-900/10">
          ← Back to Console
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Statistics Cluster */}
        <div className="lg:col-span-1 grid grid-cols-1 gap-4">
           <div className="glass-card !p-8 border-cyan-500/20 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-2xl bg-black/60">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all"></div>
              <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-6">Integrity Rating</p>
              <div className="flex items-end gap-2 mb-2">
                 <span className="text-5xl font-black text-white leading-none">{stats.reliability}%</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-black mt-2 italic shadow-inner">Elite Standings Verified</p>
           </div>

           <div className="glass-card !p-8 border-amber-500/20 relative overflow-hidden group hover:border-amber-500/40 transition-all shadow-2xl bg-black/60">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all"></div>
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-6">Total Recovery From the Start</p>
              <div className="flex items-end gap-2 mb-2">
                 <span className="text-5xl font-black text-white leading-none">₹{stats.totalDisbursed.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-black mt-2 italic">Historical Parametric Yield</p>
           </div>
        </div>

        {/* Visual Analytics Canvas */}
        <div className="lg:col-span-3">
           <div className="glass-card !p-10 border-white/10 h-full bg-black/80 shadow-2xl backdrop-blur-2xl border-l-[1px] border-t-[1px]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-4">
                 <div>
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
                       <span className="text-cyan-500 text-lg">📈</span> 12-Week Rolling Earnings Resistance Trend
                    </h3>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">Simulation Context: Predicted Shift-Value vs Real-World Displacement</p>
                 </div>
                 <div className="flex gap-6 p-4 bg-white/5 rounded-2xl border border-white/5 border-b-cyan-500/30">
                    <div className="flex items-center gap-3">
                       <span className="w-3 h-3 rounded bg-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.6)]"></span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Parametric Forecast</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="w-3 h-3 rounded bg-slate-800 border border-white/10"></span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Earnings Floor</span>
                    </div>
                 </div>
              </div>

              {/* ULTRA-RESILIENT BARS: High Visibility + Borders */}
              <div className="h-80 flex items-end gap-3 md:gap-6 px-4 mb-4 border-b border-white/10">
                 {[45, 68, 52, 85, 60, 98, 78, 45, 88, 65, 95, 75].map((h, i) => (
                    <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                       {/* Background Track (Always Visible) */}
                       <div className="w-full bg-white/5 rounded-t-xl mb-[-100%] z-0" style={{ height: '100%' }}></div>
                       
                       {/* Primary Data Bar (Cyan for Maximum Contrast) */}
                       <div 
                          className="w-full bg-gradient-to-t from-cyan-900 to-cyan-400 rounded-t-xl relative z-10 transition-all duration-500 group-hover:from-cyan-600 group-hover:to-cyan-300 shadow-[0_-5px_20px_-2px_rgba(6,182,212,0.4)] border-t-[3px] border-white/20" 
                          style={{ height: `${h}%`, minHeight: '10px' }}>
                          
                          {/* Floating Value Label (Always Shows on Mobile/Hover) */}
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-cyan-500 text-black px-3 py-1.5 rounded-xl text-[10px] font-black whitespace-nowrap shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all z-20">
                             WEEK {i+1}: ₹{(h * 115).toLocaleString()}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="flex justify-between mt-10 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-t border-white/10 pt-8">
                 {['W-01', 'W-02', 'W-03', 'W-04', 'W-05', 'W-06', 'W-07', 'W-08', 'W-09', 'W-10', 'W-11', 'W-12'].map(w => (
                    <span key={w}>{w}</span>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {/* Detailed Insights Matrix */}
         <div className="glass-card !p-12 border-white/5 bg-black/60 shadow-2xl">
            <h4 className="text-[12px] font-black text-white uppercase tracking-widest mb-12 italic flex items-center gap-3">
               <span className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 text-sm">📍</span> Regional Risk Exposure Calibration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 { zone: 'Cyberabad Hub', risk: 'Medium', bar: '60%', color: 'bg-amber-500', note: 'Extreme Thermal Exposure' },
                 { zone: 'Jubilee Hills Line', risk: 'Low', bar: '30%', color: 'bg-green-500', note: 'Nominal Operations' },
                 { zone: 'Old City Corridor', risk: 'High', bar: '85%', color: 'bg-rose-600', note: 'Critical AQI Saturation' },
               ].map(z => (
                 <div key={z.zone} className="space-y-4 p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-cyan-500/30 transition-all hover:-translate-y-2 group">
                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                       <span className="text-white group-hover:text-cyan-400 transition-colors">{z.zone}</span>
                       <span className={`px-3 py-1 rounded-full border ${z.risk === 'Low' ? 'bg-green-500/10 text-green-500 border-green-500/20' : z.risk === 'High' ? 'bg-rose-600/10 text-rose-500 border-rose-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>{z.risk} Risk</span>
                    </div>
                    <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden p-1 border border-white/5">
                       <div className={`h-full ${z.color} rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(0,0,0,0.5)]`} style={{ width: z.bar }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-black uppercase italic tracking-[0.1em]">{z.note}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
