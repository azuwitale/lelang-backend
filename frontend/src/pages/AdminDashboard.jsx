import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { getItems, createItem, updateItem, deleteItem } from '../utils/api';

// Item List Component
const ItemList = ({ onEdit, onDelete, refreshItems }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems();
        setItems(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [refreshItems]);

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
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  if (loading) {
    return <p className="text-center py-4">Loading...</p>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">Judul</th>
            <th className="py-2 px-4 text-left">Harga Awal</th>
            <th className="py-2 px-4 text-left">Harga Saat Ini</th>
            <th className="py-2 px-4 text-left">Berakhir Pada</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} className="border-b">
              <td className="py-2 px-4">{item.title}</td>
              <td className="py-2 px-4">{formatPrice(item.startingPrice)}</td>
              <td className="py-2 px-4">{formatPrice(item.currentPrice)}</td>
              <td className="py-2 px-4">{formatDate(item.endDate)}</td>
              <td className="py-2 px-4">
                <span className={`px-2 py-1 rounded text-xs ${
                  item.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.status === 'active' ? 'Aktif' : 'Berakhir'}
                </span>
              </td>
              <td className="py-2 px-4">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onEdit(item)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDelete(item._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {items.length === 0 && (
        <p className="text-center py-4 text-gray-500">Tidak ada barang lelang</p>
      )}
    </div>
  );
};

// Item Form Component
const ItemForm = ({ item, onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('active');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description);
      setStartingPrice(item.startingPrice);
      setImageUrl(item.imageUrl);
      
      // Format date for input
      const date = new Date(item.endDate);
      const formattedDate = date.toISOString().split('T')[0];
      setEndDate(formattedDate);
      
      setStatus(item.status);
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSubmit({
      title,
      description,
      startingPrice: parseFloat(startingPrice),
      imageUrl,
      endDate: new Date(endDate),
      status
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">
        {item ? 'Edit Barang Lelang' : 'Tambah Barang Lelang'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Judul Barang</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Harga Awal (IDR)</label>
          <input
            type="number"
            value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">URL Gambar</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Tanggal Berakhir</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {item && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="active">Aktif</option>
              <option value="ended">Berakhir</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        )}
        
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

// Main Dashboard Component
const AdminDashboard = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const navigate = useNavigate();

  const handleEdit = (item) => {
    setSelectedItem(item);
    navigate('/admin/edit');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
      setLoading(true);
      try {
        await deleteItem(id);
        setRefreshKey(prevKey => prevKey + 1);
      } catch (err) {
        setError(err.message || 'Failed to delete item');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      if (selectedItem) {
        await updateItem(selectedItem._id, formData);
      } else {
        await createItem(formData);
      }
      
      navigate('/admin');
      setRefreshKey(prevKey => prevKey + 1);
    } catch (err) {
      setError(err.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <Routes>
        <Route path="/" element={
          <>
            <div className="mb-4">
              <Link 
                to="/admin/add" 
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Tambah Barang
              </Link>
            </div>
            
            <ItemList 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              refreshItems={refreshKey}
            />
          </>
        } />
        
        <Route path="/add" element={
          <ItemForm 
            onSubmit={handleSubmit}
            isLoading={loading}
          />
        } />
        
        <Route path="/edit" element={
          <ItemForm 
            item={selectedItem}
            onSubmit={handleSubmit}
            isLoading={loading}
          />
        } />
      </Routes>
    </div>
  );
};

export default AdminDashboard;