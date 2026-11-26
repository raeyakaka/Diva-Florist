import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ShopProvider, useShop, asset } from './store'
import { Home, Shop, Product, Cart, Checkout, Order, Track, Info } from './pages'
import { AdminLogin, AdminDash } from './Admin'
import { DEMO } from './api'

function Layout() {
  const { count, toast } = useShop()
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [loc.pathname])
  return (<>
    <header><div className="wrap nav">
      <Link className="logo" to="/"><img src={asset('/img/logo.png')} alt="" />Diva Florist</Link>
      <button id="menu" aria-expanded={open} aria-controls="links" onClick={() => setOpen(!open)}>Menu</button>
      <nav className={'links' + (open ? ' open' : '')} id="links" aria-label="Menu utama">
        <NavLink to="/" end>Beranda</NavLink><NavLink to="/katalog">Katalog</NavLink>
        <NavLink to="/cara-pesan">Cara Pesan</NavLink><NavLink to="/lacak">Lacak Pesanan</NavLink>
        <NavLink className="cartb" to="/keranjang">Keranjang<span className="badge">{count}</span></NavLink>
      </nav></div></header>
    <main className="wrap">
      {DEMO && <p className="note" role="note" style={{ marginTop: 16 }}>Mode demo: data produk bawaan, pesanan hanya tersimpan di browser ini dan tidak dikirim ke toko.</p>}
      <Routes>
        <Route path="/" element={<Home />} /><Route path="/katalog" element={<Shop />} />
        <Route path="/produk/:slug" element={<Product />} /><Route path="/keranjang" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} /><Route path="/pesanan/:no" element={<Order />} />
        <Route path="/lacak" element={<Track />} /><Route path="/cara-pesan" element={<Info />} />
        <Route path="/admin/login" element={<AdminLogin />} /><Route path="/admin" element={<AdminDash />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </main>
    <footer><div className="wrap"><span>Diva Florist · Kontak dan FAQ di halaman <Link to="/cara-pesan">Cara Pesan</Link></span><span><Link to="/admin">Admin</Link></span></div></footer>
    <div id="toast" role="status" aria-live="polite" className={toast ? 'show' : ''}>{toast}</div>
  </>)
}

export default function App() { return <ShopProvider><Layout /></ShopProvider> }
