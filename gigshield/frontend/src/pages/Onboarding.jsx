import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState('');
  const [riderData, setRiderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      // 1. Send OTP
      const res = await axios.post(`/api/auth/otp/send`, { phone });
      setOtp(res.data.debug_otp || '123456');

      // 2. Lookup Rider (Optional)
      try {
        const r = await axios.get(`/api/auth/rider-lookup/${phone}`);
        setRiderData(r.data);
      } catch (err) {
        setRiderData({
          name: "Guest Rider",
          pan: "ABCDE1234F",
          upi_id: "demo@upi",
          city: "Hyderabad",
          zone: "HITEC City",
          platform: "zomato",
          worker_id: "ZMT-DEMO-3"
        });
      }
      setStep(2);
    } catch (e) {
      console.error(e);
      alert("Error sending OTP: " + (e.response?.data?.detail || e.message));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/auth/otp/verify`, { phone, otp });
      const t = res.data.token;
      setToken(t);
      localStorage.setItem('gs_token', t);
      localStorage.setItem('gs_phone', phone);
      setStep(3);
    } catch (e) {
      alert("Invalid OTP: " + (e.response?.data?.detail || e.message));
    } finally {
      setLoading(false);
    }
  };

  const headers = { Authorization: `Bearer ${token}` };

  const handleKYC = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/onboarding/kyc`, { 
        aadhaar: '123456789012', 
        pan: riderData?.pan || 'ABCDE1234F' 
      }, { headers });
      setStep(4);
    } catch (e) { setStep(4); }
    setLoading(false);
  };

  const handleGPS = async () => {
    setLoading(true);
    try {
      const coords = riderData?.enrollment_gps || { lat: 17.4474, lng: 78.3762 };
      await axios.post(`/api/onboarding/gps`, coords, { headers });
      setStep(5);
    } catch (e) { setStep(5); }
    setLoading(false);
  };

  const handleUPI = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/onboarding/upi`, { upi_id: riderData?.upi_id || 'demo@upi' }, { headers });
      setStep(6);
    } catch (e) { setStep(6); }
    setLoading(false);
  };

  const handleLink = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/onboarding/platform-link`,
        { worker_id: riderData?.worker_id || 'ZMT-DEMO3', platform: riderData?.platform || 'zomato' },
        { headers }
      );
      localStorage.setItem('gs_policy', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (e) { navigate('/dashboard'); }
    setLoading(false);
  };

  const stepInfo = [
    { title: 'Secure Login', desc: 'Verify phone', icon: '📱' },
    { title: 'OTP Check', desc: 'Secure verification', icon: '🔐' },
    { title: 'Identity', desc: 'KYC Identity Check', icon: '🪪' },
    { title: 'Location', desc: 'GPS Regional Setup', icon: '📍' },
    { title: 'Payments', desc: 'UPI Settlement Link', icon: '💳' },
    { title: 'Platform', desc: 'Confirm Work ID', icon: '🔗' },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-xl !p-0 overflow-hidden shadow-2xl relative border border-white/10">
        
        <div className="p-8 pb-0">
           <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Gig<span className="text-blue-500">Shield</span></h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Parametric Protection</p>
              </div>
              <div className="text-right">
                 <p className="text-xs font-bold text-slate-400">Step {step} of 6</p>
                 <div className="flex gap-1 mt-1 justify-end">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= step ? 'w-4 bg-blue-500' : 'w-2 bg-slate-800'}`}></div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-6 gap-2 mb-10">
              {stepInfo.map((s, i) => (
                <div key={i} className="flex flex-col items-center group">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg transition-all duration-500 ${
                    i + 1 < step ? 'bg-green-500 text-white shadow-lg' :
                    i + 1 === step ? 'bg-blue-600 text-white shadow-xl scale-110' :
                    'bg-slate-900/50 text-slate-600 border border-white/5'
                  }`}>
                    {i + 1 < step ? '✓' : s.icon}
                  </div>
                  <p className={`text-[8px] font-bold uppercase mt-2 ${i + 1 === step ? 'text-blue-400' : 'text-slate-600'}`}>{s.title.split(' ')[0]}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="p-8 pt-0 min-h-[300px] flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">{stepInfo[step - 1]?.title}</h2>
              <p className="text-slate-400 text-sm">{stepInfo[step - 1]?.desc}</p>
            </div>

            {loading ? (
               <div className="flex flex-col items-center py-10">
                  <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
               </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {step === 1 && (
                  <div className="flex flex-col gap-5">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">+91</span>
                      <input className="w-full bg-white/5 border border-white/10 p-4 pl-14 rounded-2xl text-white font-bold" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl font-bold transition" onClick={handleSendOTP}>Send OTP</button>
                  </div>
                )}
                {step === 2 && (
                  <div className="flex flex-col gap-5">
                    <input className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white text-center text-3xl font-black" value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" />
                    <button className="bg-green-600 hover:bg-green-500 text-white p-4 rounded-2xl font-bold transition" onClick={handleVerifyOTP}>Verify OTP</button>
                  </div>
                )}
                {step === 3 && (
                  <div className="flex flex-col gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white">
                      <p className="text-slate-400 text-xs uppercase mb-1">Rider</p>
                      <p className="text-xl font-bold mb-4">{riderData?.name}</p>
                      <p className="text-slate-400 text-xs">PAN: {riderData?.pan}</p>
                    </div>
                    <button className="bg-blue-600 text-white p-4 rounded-2xl font-bold" onClick={handleKYC}>Confirm Identity</button>
                  </div>
                )}
                {step === 4 && (
                  <div className="flex flex-col gap-6">
                    <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-6 text-center text-white">
                      <p className="text-2xl font-bold mb-2">{riderData?.city}</p>
                      <p className="text-sm text-blue-400">{riderData?.zone}</p>
                    </div>
                    <button className="bg-blue-600 text-white p-4 rounded-2xl font-bold" onClick={handleGPS}>Confirm Location</button>
                  </div>
                )}
                {step === 5 && (
                  <div className="flex flex-col gap-6">
                    <div className="relative">
                      <label className="text-[10px] uppercase text-slate-500 font-bold mb-2 block">UPI ID</label>
                      <input className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold" value={riderData?.upi_id} readOnly />
                    </div>
                    <button className="bg-blue-600 text-white p-4 rounded-2xl font-bold" onClick={handleUPI}>Validate UPI</button>
                  </div>
                )}
                {step === 6 && (
                  <div className="flex flex-col gap-6 text-white">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex justify-between items-center">
                      <span>{riderData?.platform}</span>
                      <span className="font-mono">{riderData?.worker_id}</span>
                    </div>
                    <button className="bg-blue-600 text-white p-4 rounded-2xl font-bold" onClick={handleLink}>Initialize Policy</button>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
