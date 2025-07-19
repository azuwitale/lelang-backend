import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getItemById, getBidsByItem } from '../utils/api';
import BidForm from '../components/BidForm';

const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const itemData = await getItemById(id);
      setItem(itemData);
      
      const bidsData = await getBidsByItem(id);
      setBids(bidsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch item details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleBidSuccess = () => {
    fetchData(); // Refresh data after successful bid
  };

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Item tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
        
        <div className="mb-6">
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-80 object-cover rounded-lg"
          />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-2">Detail Barang</h2>
          <p className="mb-4">{item.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <span className="text-gray-600">Harga Awal:</span>
              <span className="font-semibold ml-2">
                {formatPrice(item.startingPrice)}
              </span>
            </div>
            
            <div>
              <span className="text-gray-600">Harga Saat Ini:</span>
              <span className="font-bold text-green-600 ml-2">
                {formatPrice(item.currentPrice)}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600">Status:</span>
              <span className={`font-semibold ml-2 ${
                item.status === 'active' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {item.status === 'active' ? 'Aktif' : 'Berakhir'}
              </span>
            </div>
            
            <div>
              <span className="text-gray-600">Berakhir pada:</span>
              <span className="font-semibold ml-2">
                {formatDate(item.endDate)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Riwayat Penawaran</h2>
          
          {bids.length === 0 ? (
            <p className="text-gray-500">Belum ada penawaran untuk barang ini</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Penawar</th>
                    <th className="py-2 px-4 text-left">Jumlah</th>
                    <th className="py-2 px-4 text-left">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map((bid) => (
                    <tr key={bid._id} className="border-b">
                      <td className="py-2 px-4">{bid.bidder.username}</td>
                      <td className="py-2 px-4 font-medium">
                        {formatPrice(bid.amount)}
                      </td>
                      <td className="py-2 px-4 text-sm">
                        {formatDate(bid.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <BidForm item={item} onBidSuccess={handleBidSuccess} />
      </div>
    </div>
  );
};

export default ItemDetailPage;