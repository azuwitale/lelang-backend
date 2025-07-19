const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('../models/User');
const Item = require('../models/Item');
const Bid = require('../models/Bid');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
    process.exit(1);
  });

// Seed data function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});
    await Bid.deleteMany({});

    console.log('Previous data cleared');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      isAdmin: true
    });

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const regularUser = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: userPassword,
      isAdmin: false
    });

    console.log('Users created');

    // Create sample items
    const items = await Item.insertMany([
      {
        title: 'Lukisan Vintage',
        description: 'Lukisan bergaya vintage yang dibuat oleh seniman terkenal pada tahun 1980-an. Kondisi masih sangat baik dan terawat.',
        startingPrice: 1000000,
        currentPrice: 1000000,
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        seller: admin._id,
        status: 'active',
        category: 'Art',
        condition: 'Used',
        location: 'Jakarta'
      },
      {
        title: 'Jam Tangan Antik',
        description: 'Jam tangan antik dari era 1950-an. Masih berfungsi dengan baik dan kondisinya terawat.',
        startingPrice: 5000000,
        currentPrice: 5000000,
        imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314',
        endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        seller: admin._id,
        status: 'active',
        category: 'Collectibles',
        condition: 'Used',
        location: 'Bandung'
      },
      {
        title: 'Kamera DSLR Profesional',
        description: 'Kamera DSLR high-end dengan lensa kit. Sedikit bekas tapi dalam kondisi sempurna.',
        startingPrice: 8000000,
        currentPrice: 8500000,
        imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd',
        endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        seller: admin._id,
        status: 'active',
        category: 'Electronics',
        condition: 'Used',
        location: 'Surabaya'
      }
    ]);

    console.log('Items created');

    // Create sample bids
    await Bid.create({
      item: items[2]._id, // Bid for the camera
      bidder: regularUser._id,
      amount: 8500000,
      timestamp: new Date(),
      status: 'active'
    });

    console.log('Bids created');
    console.log('Database seeded successfully!');

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();