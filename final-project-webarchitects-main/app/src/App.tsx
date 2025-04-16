import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import NgoManagement from './pages/NgoManagement.tsx';
import ProductDetailsPage from './pages/ProductDetailsPage';
import FoodProducts from './pages/FoodProducts';
import DietGenerator from './pages/DietGenerator.tsx';
import PetAdoptionApp from './pages/PetAdoptionApp.tsx';
import FundraiserManagement from './pages/FundraiserManagement.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import PetSalonPage from './pages/PetSalonPage.tsx';
import VetPage from './pages/VetPage.tsx';
import PetTherapyPage from './pages/PetTherapyPage.tsx';
import NGONearMePage from './pages/NGONearMePage.tsx';
import CartPage from './pages/CartPage.tsx';
import HomePage from './pages/HomePage.tsx';
import PetCare from './pages/PetCare.tsx';
import TipsPage from './pages/Tips.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import GeolocationHandler from './components/GeolocationHandler.tsx';
import ClipboardHandler from './components/ClipboardHandler.tsx';
// import FileHandler from './components/FileHandler.tsx';
// import NetworkStatusHandler from './components/NetworkStatusHandler.tsx';
import BluetoothHandler from './components/BluetoothHandler.tsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Define routes for different pages */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path='/homepage' element={<HomePage/>} />
          <Route path="/ngo-management" element={<NgoManagement />} /> {/* NGO Management Page */}
          <Route path="/petadopt" element={<PetAdoptionApp />} />
          <Route path="/foodproducts" element={<FoodProducts />} />
          <Route path="/productdetails" element={<ProductDetailsPage />} />
          <Route path='/dietgenerator' element={< DietGenerator />} />
          <Route path='/fundraisermanagement' element={< FundraiserManagement />} />
          <Route path='/admin' element={< AdminDashboard />} />
          <Route path='/petsalon' element={< PetSalonPage />} />
          <Route path='/vet' element={< VetPage />} />
          <Route path='/pettherapy' element={< PetTherapyPage />} />
          <Route path='/ngo' element={< NGONearMePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/petcare" element={<PetCare />} />
          <Route path='/tips' element={<TipsPage/>} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/geolocation" element={<GeolocationHandler />} />
          <Route path="/clipboard" element={<ClipboardHandler />} />
          {/* <Route path="/file" element={<FileHandler />} /> */}
          {/* <Route path="/network" element={<NetworkStatusHandler />} /> */}
          <Route path="/bluetooth" element={<BluetoothHandler />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
