import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Product from './pages/Product.jsx';
import SizeGuide from './pages/SizeGuide.jsx';
import Checkout from './pages/Checkout.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/product/:slug" element={<Product />} />
      <Route path="/size-guide" element={<SizeGuide />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}
