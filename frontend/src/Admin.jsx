import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from './api'
import { rp, STATUS, SZ } from './store'

export function AdminLogin() {
  const nav = useNavigate()
  const [f, setF] = useState({ email: '', password: '' }), [err, setErr] = useState('')
  async function go(e) {
    e.preventDefault(); setErr('')
    try { const r = await api.post('/admin/login', f); localStorage.setItem('dv-admin', r.data.token); nav('/admin') }
    catch { setErr('Email atau password salah.') }
  }
  return (<section style={{ maxWidth: 420 }}><h1>Login Admin</h1>
    <form onSubmit={go} style={{ marginTop: 20 }}>
      <div className="f"><label htmlFor="em">Email</label><input id="em" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
      <div className="f"><label htmlFor="pw">Password</label><input id="pw" type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></div>
      {err && <small className="err" role="alert">{err}</small>}
      <button className="btn" style={{ marginTop: 10 }}>Masuk</button></form></section>)
}

export function AdminDash() {
  const nav = useNavigate()
  const [tab, setTab] = useState('orders'), [orders, setOrders] = useState([]), [products, setProducts] = useState([]), [msg, setMsg] = useState('')
  const guard = (e) => { if (e.response?.status === 401) { localStorage.removeItem('dv-admin'); nav('/admin/login') } }
  const load = () => {
    api.get('/admin/orders').then((r) => setOrders(r.data.data)).catch(guard)
    api.get('/admin/products').then((r) => setProducts(r.data.data)).catch(guard)
  }
  useEffect(() => { if (!localStorage.getItem('dv-admin')) nav('/admin/login'); else load() }, [])
  const setStatus = (id, status) => api.patch(`/admin/orders/${id}`, { status }).then(() => { setMsg('Status diperbarui'); load() }).catch(guard)
  const saveProduct = (p) => api.put(`/admin/products/${p.id}`, p).then(() => { setMsg('Produk disimpan'); load() }).catch(guard)
  const logout = () => api.post('/admin/logout').finally(() => { localStorage.removeItem('dv-admin'); nav('/admin/login') })

  return (<section><div className="sh"><h1>Dashboard Admin</h1><button className="btn alt" onClick={logout}>Keluar</button></div>
    <div className="tabs"><button className={'btn' + (tab === 'orders' ? '' : ' alt')} onClick={() => setTab('orders')}>Pesanan ({orders.length})</button>
      <button className={'btn' + (tab === 'products' ? '' : ' alt')} onClick={() => setTab('products')}>Produk ({products.length})</button></div>
    <p className="mu" role="status" style={{ minHeight: 24 }}>{msg}</p>
    {tab === 'orders' ? <div className="tblw"><table><thead><tr><th>No.</th><th>Penerima</th><th>Kirim</th><th>Item</th><th>Total</th><th>Status</th></tr></thead><tbody>
      {orders.map((o) => <tr key={o.id}><td><strong>{o.order_number}</strong></td>
        <td>{o.receiver_name}<br /><span className="mu">{o.receiver_phone}</span></td>
        <td>{o.delivery_date}<br /><span className="mu">{o.delivery_slot}</span></td>
        <td>{o.items.map((i) => <div key={i.id}>{i.product_name} ({SZ[i.size]}) ×{i.qty}{i.card_message && <em className="mu"> “{i.card_message}”</em>}</div>)}</td>
        <td>{rp(o.total)}</td>
        <td><select aria-label={`Status ${o.order_number}`} value={o.status} onChange={(e) => setStatus(o.id, e.target.value)}>
          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></td></tr>)}
      {!orders.length && <tr><td colSpan="6" className="mu">Belum ada pesanan.</td></tr>}</tbody></table></div>
      : <div className="tblw"><table><thead><tr><th>Produk</th><th>Harga S / M / L</th><th>Aktif</th><th></th></tr></thead><tbody>
        {products.map((p, n) => <tr key={p.id}><td>{p.name}</td>
          <td><div className="inl">{['S', 'M', 'L'].map((k) => <input key={k} type="number" aria-label={`Harga ${k} ${p.name}`} value={p.prices[k]}
            onChange={(e) => setProducts(products.map((x, i) => i === n ? { ...x, prices: { ...x.prices, [k]: +e.target.value } } : x))} />)}</div></td>
          <td><input type="checkbox" style={{ width: 20 }} aria-label={`Aktif ${p.name}`} checked={p.is_active} onChange={(e) => setProducts(products.map((x, i) => i === n ? { ...x, is_active: e.target.checked } : x))} /></td>
          <td><button className="btn" style={{ padding: '8px 18px' }} onClick={() => saveProduct(p)}>Simpan</button></td></tr>)}</tbody></table></div>}
  </section>)
}
