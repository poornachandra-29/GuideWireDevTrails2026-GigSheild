import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      const res = await axios.post('http://localhost:8000/auth/otp/send', { phone });
      setOtp(res.data.debug_otp || '');
      setStep(2);
    } catch (e) {
      alert("Error sending OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const res = await axios.post('http://localhost:8000/auth/otp/verify', { phone, otp });
      setToken(res.data.token);
      setStep(3);
    } catch (e) {
      alert("Invalid OTP");
    }
  };

  const skipKYC = () => setStep(4);
  const skipGPS = () => setStep(5);
  const skipUPI = () => setStep(6);
  
  const handleLink = async () => {
    try {
      await axios.post('http://localhost:8000/onboarding/platform-link', 
        { worker_id: 'ZMT-DEMO3', platform: 'zomato' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/dashboard');
    } catch (e) {
      alert("Error linking");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg w-full">
      <h2 className="text-xl mb-4 font-semibold text-center mt-2">Onboarding ({step}/6)</h2>
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <input className="border p-2 rounded" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone Number" />
          <button className="bg-blue-600 text-white p-2 rounded" onClick={handleSendOTP}>Send OTP</button>
        </div>
      )}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <input className="border p-2 rounded" value={otp} onChange={e=>setOtp(e.target.value)} placeholder="123456" />
          <button className="bg-green-600 text-white p-2 rounded" onClick={handleVerifyOTP}>Verify OTP</button>
        </div>
      )}
      {step === 3 && (
        <div className="flex flex-col gap-4 text-center">
          <p>Aadhaar / PAN KYC</p>
          <button className="bg-blue-600 text-white p-2 rounded" onClick={skipKYC}>Verify Identity Mock</button>
        </div>
      )}
      {step === 4 && (
        <div className="flex flex-col gap-4 text-center">
          <p>Detecting Location: Hyderabad</p>
          <button className="bg-blue-600 text-white p-2 rounded" onClick={skipGPS}>Confirm City</button>
        </div>
      )}
      {step === 5 && (
        <div className="flex flex-col gap-4">
          <input className="border p-2 rounded" defaultValue="ravi.demo@upi" placeholder="UPI ID" />
          <button className="bg-blue-600 text-white p-2 rounded" onClick={skipUPI}>Validate UPI</button>
        </div>
      )}
      {step === 6 && (
        <div className="flex flex-col gap-4 text-center">
           <p>Link Zomato ID: ZMT-DEMO3</p>
           <button className="bg-blue-600 text-white p-2 rounded" onClick={handleLink}>Link Account</button>
        </div>
      )}
    </div>
  );
}
