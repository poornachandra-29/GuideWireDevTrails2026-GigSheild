import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold">Policy: GS-ZMT-2026-DEMO3</h2>
        <div className="mt-2 text-sm text-gray-700">
          <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded">Shield Plan</span>
          <p className="mt-2">Premium: ₹67.45 / week</p>
          <p>Coverage: 75% | Max ₹1500/day</p>
          <p className="text-green-600 font-bold mt-2">Status: ACTIVE</p>
        </div>
        <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
          <strong>Risk Analysis: Score 78</strong>
          <p>Your HITEC City zone waterlogging score (8/10) impacts your premium. Your 58 weeks of tenure gives a stability discount.</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-2">Payout History</h2>
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Type</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">2026-04-02</td>
              <td className="p-2 bg-red-100 text-red-800 rounded px-2">AQI (318)</td>
              <td className="p-2"><Link to="/claim/demo" className="text-blue-600 underline">View Detail</Link></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
