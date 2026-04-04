import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Payments() {
  const [payouts, setPayouts] = useState([]);
  const [policy, setPolicy] = useState(null);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getHeaders = () => {
    const token = localStorage.getItem('gs_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const headers = getHeaders();
        const [polRes, claimRes] = await Promise.all([
          axios.get('http://localhost:8000/policy/me', { headers }),
          axios.get('http://localhost:8000/claims/me', { headers })
        ]);
        setPolicy(polRes.data);
        setPayouts(claimRes.data || []);
      } catch (e) {
        console.error("Payments fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const fetchBreakdown = async (payoutId) => {
    if (selectedPayout === payoutId) {
      setSelectedPayout(null);
      setBreakdown(null);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:8000/claims/${payoutId}/breakdown`, { headers: getHeaders() });
      setBreakdown(res.data);
      setSelectedPayout(payoutId);
    } catch (e) {
      console.error("Breakdown fetch error:", e);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 gap-4">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        <p className="text-white font-semibold text-lg animate-pulse">Loading Payment Details...</p>
      </div>
    );
  }

  const totalEarned = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalProcessed = payouts.filter(p => p.status === 'processed' || p.status === 'sent').length;
  const totalPending = payouts.filter(p => p.status === 'pending').length;

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Payments</h1>
          <p className="text-blue-100 text-sm">Detailed payout history & breakdowns</p>
        </div>
        <Link to="/dashboard"
          className="px-4 py-2 glass text-sm font-semibold text-gray-700 hover:bg-white/80 transition"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Earned</p>
          <p className="text-3xl font-extrabold text-green-600 mt-1">₹{totalEarned.toFixed(0)}</p>
          <p className="text-xs text-gray-400 mt-1">From all payouts</p>
        </div>
        <div className="glass p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Processed Payouts</p>
          <p className="text-3xl font-extrabold text-blue-600 mt-1">{totalProcessed}</p>
          <p className="text-xs text-gray-400 mt-1">Successfully sent to UPI</p>
        </div>
        <div className="glass p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Weekly Premium</p>
          <p className="text-3xl font-extrabold text-gray-800 mt-1">₹{policy?.premium_amount || '—'}</p>
          <p className="text-xs text-gray-400 mt-1">{policy?.plan} plan • {policy?.city}</p>
        </div>
      </div>

      {/* Premium Payment Schedule */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <span>💳</span> Premium Payment Schedule
        </h2>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500">Plan</p>
              <p className="font-bold text-gray-800 capitalize">{policy?.plan || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Premium/Week</p>
              <p className="font-bold text-blue-600">₹{policy?.premium_amount?.toFixed(0) || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Coverage</p>
              <p className="font-bold text-gray-800">{policy?.coverage_ratio ? `${(policy.coverage_ratio * 100).toFixed(0)}%` : '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Max Payout/Day</p>
              <p className="font-bold text-green-600">₹{policy?.max_daily_payout || '—'}</p>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 border-t border-blue-100 pt-3">
            <p>Premium is auto-deducted weekly. Coverage activates immediately upon payment confirmation.</p>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>📊</span> Payout History
        </h2>

        {payouts.length === 0 ? (
          <div className="text-center py-10">
            <span className="text-5xl block mb-3">🛡️</span>
            <p className="text-gray-600 font-semibold">No Payouts Yet</p>
            <p className="text-gray-400 text-sm mt-1">Your coverage is active. When extreme weather triggers a payout, it will appear here with full breakdown.</p>
            
            {/* Demo Payout Explanation */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 text-left max-w-lg mx-auto border border-blue-100">
              <p className="font-bold text-gray-800 text-sm mb-3">How payouts work:</p>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3 items-start">
                  <span className="bg-blue-100 text-blue-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">1</span>
                  <div>
                    <p className="font-semibold text-gray-700">Weather Trigger Detected</p>
                    <p className="text-gray-500 text-xs">System detects AQI &gt; 300, Rainfall &gt; 10mm/hr, or Temp &gt; 45°C at your GPS</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="bg-blue-100 text-blue-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">2</span>
                  <div>
                    <p className="font-semibold text-gray-700">Income Gap Calculated</p>
                    <p className="text-gray-500 text-xs">Your trigger-week earnings are compared with your 4-week baseline average</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="bg-blue-100 text-blue-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">3</span>
                  <div>
                    <p className="font-semibold text-gray-700">Payout Formula Applied</p>
                    <p className="text-gray-500 text-xs">Income Gap × Coverage Ratio × Zone Modifier × Consistency + Loyalty Bonus</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="bg-green-100 text-green-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">4</span>
                  <div>
                    <p className="font-semibold text-gray-700">Phase 1: Instant 40% Advance</p>
                    <p className="text-gray-500 text-xs">Sent to your UPI within minutes of trigger detection</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="bg-green-100 text-green-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">5</span>
                  <div>
                    <p className="font-semibold text-gray-700">Phase 2: Remaining 60% Settlement</p>
                    <p className="text-gray-500 text-xs">After fraud verification, remaining amount sent within 48hrs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Example Calculation */}
            <div className="mt-4 bg-white/60 rounded-xl p-5 text-left max-w-lg mx-auto border border-gray-200">
              <p className="font-bold text-gray-700 text-sm mb-3">📝 Example Calculation (Hypothetical)</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-600">Baseline weekly earnings</span>
                  <span className="font-semibold">₹5,100</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-600">Trigger week actual</span>
                  <span className="font-semibold text-red-500">₹2,600</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-600">Income gap</span>
                  <span className="font-bold text-red-600">₹2,500</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-600">× Coverage ratio ({policy?.plan || 'Shield'} {policy?.coverage_ratio ? `${(policy.coverage_ratio*100).toFixed(0)}%` : '75%'})</span>
                  <span className="font-semibold">₹{policy?.coverage_ratio ? (2500 * policy.coverage_ratio).toFixed(0) : '1,875'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-600">× Zone modifier (1.20)</span>
                  <span className="font-semibold">₹{policy?.coverage_ratio ? (2500 * policy.coverage_ratio * 1.2).toFixed(0) : '2,250'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-600">+ Loyalty bonus (10%)</span>
                  <span className="font-semibold text-green-600">+₹{policy?.coverage_ratio ? (2500 * policy.coverage_ratio * 1.2 * 0.1).toFixed(0) : '225'}</span>
                </div>
                <div className="flex justify-between pt-1 text-base">
                  <span className="font-bold text-gray-800">= Total payout</span>
                  <span className="font-extrabold text-green-600">₹{policy?.coverage_ratio ? (2500 * policy.coverage_ratio * 1.2 * 1.1).toFixed(0) : '2,475'}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-green-50 rounded-lg p-2 text-center border border-green-200">
                  <p className="text-xs text-green-700 font-semibold">Phase 1 Instant</p>
                  <p className="font-bold text-green-600">₹{policy?.coverage_ratio ? (2500 * policy.coverage_ratio * 1.2 * 1.1 * 0.4).toFixed(0) : '990'}</p>
                  <p className="text-[10px] text-green-500">40% • Sent within mins</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-200">
                  <p className="text-xs text-blue-700 font-semibold">Phase 2 Settlement</p>
                  <p className="font-bold text-blue-600">₹{policy?.coverage_ratio ? (2500 * policy.coverage_ratio * 1.2 * 1.1 * 0.6).toFixed(0) : '1,485'}</p>
                  <p className="text-[10px] text-blue-500">60% • After verification</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {payouts.map(p => (
              <div key={p.payout_id}>
                <div
                  onClick={() => fetchBreakdown(p.payout_id)}
                  className={`rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedPayout === p.payout_id ? 'border-blue-400 bg-blue-50/50' : 'border-transparent bg-white/50 hover:bg-white/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {p.trigger_type === 'aqi' ? '🌫️' : p.trigger_type === 'rainfall' ? '🌊' : '🔥'}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-800">{p.trigger_type === 'rainfall' ? 'Heavy Rainfall' : p.trigger_type?.toUpperCase()} Trigger</p>
                        <p className="text-xs text-gray-500">{p.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-green-600">₹{p.amount?.toFixed(0)}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        p.status === 'processed' || p.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-blue-500 mt-2">{selectedPayout === p.payout_id ? '▲ Hide breakdown' : '▼ Tap to view full breakdown'}</p>
                </div>

                {/* Expandable Breakdown */}
                {selectedPayout === p.payout_id && breakdown && (
                  <div className="ml-4 mr-4 mt-1 bg-white/80 rounded-xl border border-gray-200 p-5 space-y-3 text-sm">
                    <p className="font-bold text-gray-800 text-base">💰 Payout Calculation Breakdown</p>

                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-600">Baseline weekly earnings</span>
                        <span className="font-semibold">₹{breakdown.baseline_earnings?.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-600">Trigger week actual</span>
                        <span className="font-semibold text-red-500">₹{breakdown.trigger_week_earnings?.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-600">Income gap</span>
                        <span className="font-bold text-red-600">₹{breakdown.income_gap?.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-600">{breakdown.coverage_ratio_label}</span>
                        <span className="font-semibold">×{breakdown.coverage_ratio}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-600">{breakdown.zone_modifier_label}</span>
                        <span className="font-semibold">×{breakdown.zone_modifier}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-600">{breakdown.consistency_multiplier_label}</span>
                        <span className="font-semibold">×{breakdown.consistency_multiplier}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-600">{breakdown.loyalty_bonus_label}</span>
                        <span className="font-semibold text-green-600">+₹{breakdown.loyalty_bonus?.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between pt-1 text-base">
                        <span className="font-bold">Total payout</span>
                        <span className="font-extrabold text-green-600">₹{breakdown.total_payout?.toFixed(0)}</span>
                      </div>
                    </div>

                    {/* Formula */}
                    {breakdown.formula_text && (
                      <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 font-mono border border-gray-200">
                        {breakdown.formula_text}
                      </div>
                    )}

                    {/* Phase Breakdown */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                        <p className="text-xs text-green-700 font-semibold">Phase 1 Advance (40%)</p>
                        <p className="font-bold text-xl text-green-600">₹{breakdown.phase1_amount?.toFixed(0)}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          breakdown.phase1_status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {breakdown.phase1_status?.toUpperCase()}
                        </span>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                        <p className="text-xs text-blue-700 font-semibold">Phase 2 Settlement (60%)</p>
                        <p className="font-bold text-xl text-blue-600">₹{breakdown.phase2_amount?.toFixed(0)}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          breakdown.phase2_status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {breakdown.phase2_status?.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Fraud Check */}
                    <div className={`rounded-lg p-3 text-center text-sm font-semibold ${
                      breakdown.fraud_decision === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                      breakdown.fraud_decision === 'review' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                      'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {breakdown.fraud_decision === 'approved' ? '✅' : breakdown.fraud_decision === 'review' ? '🔍' : '🚫'}
                      {' '}Fraud Score: {breakdown.fraud_score?.toFixed(2)} — {breakdown.fraud_decision?.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
