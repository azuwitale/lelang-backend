import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
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

  // Get time remaining
  const getTimeRemaining = (endDate) => {
    const total = new Date(endDate) - new Date();
    if (total <= 0) {
      return 'Selesai';
    }

    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} hari ${hours} jam`;
    }
    return `${hours} jam`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={item.imageUrl} 
        alt={item.title} 
        className="w-full h-48 object-cover"
      />
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
        
        <div className="mb-2">
          <span className="text-gray-600">Harga Saat Ini:</span>
          <span className="font-bold text-green-600 ml-2">
            {formatPrice(item.currentPrice)}
          </span>
        </div>
        
        <div className="mb-4">
          <span className="text-gray-600">Sisa Waktu:</span>
          <span className="font-semibold ml-2">
            {getTimeRemaining(item.endDate)}
          </span>
        </div>
        
        <Link 
          to={`/items/${item._id}`}
          className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;