import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { createBid } from '../utils/api';

const BidForm = ({ item, onBidSuccess }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Silahkan login terlebih dahulu untuk melakukan penawaran');
      return;
    }

    if (!amount || amount <= 0) {
      setError('Masukkan jumlah penawaran yang valid');
      return;
    }

    if (parseFloat(amount) <= item.currentPrice) {
      setError(`Penawaran harus lebih tinggi dari harga saat ini (${item.currentPrice})`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createBid({
        itemId: item._id,
        amount: parseFloat(amount)
      });
      
      setAmount('');
      if (onBidSuccess) onBidSuccess();
    } catch (err) {
      setError(err.message || 'Gagal melakukan penawaran');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-bold text-lg mb-4">Buat Penawaran</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Jumlah Penawaran (IDR)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan jumlah penawaran"
            min={item.currentPrice + 1}
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? 'Memproses...' : 'Tawar Sekarang'}
        </button>
        
        {!user && (
          <p className="text-sm text-gray-500 mt-2">
            Anda harus login untuk melakukan penawaran
          </p>
        )}
      </form>
    </div>
  );
};

export default BidForm;