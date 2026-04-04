import { Link } from 'react-router-dom';

export default function ClaimDetail() {
  return (
    <div className="bg-white p-6 rounded shadow w-full">
      <Link to="/dashboard" className="text-blue-600 mb-4 inline-block">&larr; Back to Dashboard</Link>
      <h2 className="text-2xl font-bold mb-4">Claim Breakdown: AQI Trigger</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between border-b pb-2">
          <span>Baseline earnings:</span>
          <strong>₹5,100</strong>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span>Trigger week actual:</span>
          <strong>₹2,600</strong>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span>Income gap:</span>
          <strong className="text-red-600">₹2,500</strong>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span>× Coverage ratio (Shield 75%):</span>
          <strong>₹1,875</strong>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span>× Zone modifier (1.20):</span>
          <strong>₹2,250</strong>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span>× Consistency (1.0):</span>
          <strong>₹2,250</strong>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span>+ Loyalty bonus (10%):</span>
          <strong>₹225</strong>
        </div>
        <div className="flex justify-between border-b pb-2 text-xl font-bold">
          <span>= Final payout:</span>
          <span className="text-green-600">₹2,475</span>
        </div>
      </div>
      
      <div className="mt-8 bg-blue-50 p-4 rounded text-center">
        <h3 className="font-bold">Phase 1 Advance: ₹990</h3>
        <p className="text-sm text-green-700 bg-green-100 p-1 px-3 mt-2 rounded inline-block">Sent to ravi.demo@upi ✅</p>
      </div>
      <div className="mt-4 bg-gray-50 p-4 rounded text-center">
        <h3 className="font-bold">Phase 2 Pending: ₹1,485</h3>
        <p className="text-xs text-gray-500 mt-2">Will be disbursed next Monday upon final settlement.</p>
      </div>
    </div>
  );
}
