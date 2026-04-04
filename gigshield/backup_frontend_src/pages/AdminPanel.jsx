import { useState } from 'react';
import axios from 'axios';

export default function AdminPanel() {
  const [city, setCity] = useState("Hyderabad");
  const [calamity, setCalamity] = useState(false);
  const [status, setStatus] = useState("");

  const handleFire = async () => {
    setStatus("Firing trigger logic...");
    try {
      await axios.post('http://localhost:8000/admin/trigger/simulate', {
        city,
        trigger_type: "aqi",
        trigger_value: 318,
        calamity_mode: calamity
      });
      setStatus("Trigger fired! 3 claims generated. Check fraud queue.");
    } catch(err) {
      setStatus("Error firing trigger");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-red-50 p-6 rounded shadow border-l-4 border-red-600">
        <h2 className="text-xl font-bold text-red-800">Trigger Simulator</h2>
        <div className="flex gap-4 mt-4 items-end">
          <label className="flex flex-col">
            <span className="text-sm font-semibold">City</span>
            <select className="p-2 border rounded" value={city} onChange={e=>setCity(e.target.value)}>
              <option>Hyderabad</option>
              <option>Delhi</option>
              <option>Mumbai</option>
            </select>
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-semibold text-gray-600">Trigger Type</span>
            <input className="p-2 border rounded bg-gray-100" value="AQI" disabled />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-semibold text-gray-600">Value</span>
            <input className="p-2 border rounded bg-gray-100" value="318" disabled />
          </label>
          <label className="flex gap-2 items-center bg-white p-2 rounded border">
            <input type="checkbox" checked={calamity} onChange={e=>setCalamity(e.target.checked)} />
            <span className="text-sm font-bold text-red-600">Calamity Mode (Part 19)</span>
          </label>
          <button className="bg-red-600 text-white font-bold p-2 px-6 rounded" onClick={handleFire}>FIRE TRIGGER</button>
        </div>
        <p className="mt-4 font-mono text-sm">{status}</p>
      </div>

      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="text-xl font-bold mb-4">Fraud Queue</h2>
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Worker ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Flags Found</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b bg-amber-50">
              <td className="p-2">ZMT-DEMO1</td>
              <td className="p-2">Fraud Demo One</td>
              <td className="p-2"><span className="bg-red-200 text-red-800 px-2 rounded font-mono text-xs">Velocity Spoof (1400 km/h)</span></td>
              <td className="p-2"><button className="bg-gray-800 text-white px-3 py-1 rounded">Blocked</button></td>
            </tr>
            <tr className="border-b bg-amber-50">
              <td className="p-2">ZMT-DEMO2</td>
              <td className="p-2">Fraud Demo Two</td>
              <td className="p-2"><span className="bg-red-200 text-red-800 px-2 rounded font-mono text-xs">Zero Jitter (GPS spoof)</span></td>
              <td className="p-2"><button className="bg-gray-800 text-white px-3 py-1 rounded">Blocked</button></td>
            </tr>
            <tr className="border-b">
              <td className="p-2">ZMT-DEMO3</td>
              <td className="p-2">Ravi Kumar Demo</td>
              <td className="p-2"><span className="bg-green-100 text-green-800 px-2 rounded font-mono text-xs">Clean</span></td>
              <td className="p-2"><button className="bg-green-600 text-white px-3 py-1 rounded">Approved</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
