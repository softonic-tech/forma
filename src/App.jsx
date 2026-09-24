import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Product from './pages/Product.jsx';
import SizeGuide from './pages/SizeGuide.jsx';
import Checkout from './pages/Checkout.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminProductEdit from './pages/admin/AdminProductEdit.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminInquiries from './pages/admin/AdminInquiries.jsx';
import AdminColors from './pages/admin/AdminColors.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';

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
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductEdit />} />
        <Route path="products/:id" element={<AdminProductEdit />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="inquiries" element={<AdminInquiries />} />
        <Route path="colors" element={<AdminColors />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
