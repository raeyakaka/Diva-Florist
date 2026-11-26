import { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api'

const Ctx = createContext()
export const useShop = () => useContext(Ctx)
export const asset = (p) => import.meta.env.BASE_URL + p.replace(/^\//, '')
export const rp = (n) => 'Rp ' + Number(n).toLocaleString('id-ID')
export const WA = 'https://wa.me/6281200000000'
export const SZ = { S: 'Kecil', M: 'Sedang', L: 'Besar' }
export const STATUS = { pending: 'Pesanan diterima', processing: 'Diproses', shipped: 'Dikirim', done: 'Selesai', cancelled: 'Dibatalkan' }

export function ShopProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dv-cart')) || [] } catch { return [] }
  })

  useEffect(() => {
    api.get('/products')
      .then((r) => setProducts(r.data.data))
      .catch(() => setError('Katalog gagal dimuat. Pastikan server Laravel sedang berjalan.'))
      .finally(() => setLoading(false))
  }, [])
  useEffect(() => { try { localStorage.setItem('dv-cart', JSON.stringify(cart)) } catch {} }, [cart])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2400)
    return () => clearTimeout(t)
  }, [toast])

  const find = (slug) => products.find((p) => p.slug === slug)
  const price = (it) => find(it.slug)?.prices?.[it.size] ?? 0
  const lines = cart.map((it, i) => ({ ...it, i, p: find(it.slug) })).filter((l) => l.p)
  const total = lines.reduce((a, l) => a + price(l) * l.qty, 0)
  const count = lines.reduce((a, l) => a + l.qty, 0)

  const add = (it) => setCart((c) => {
    const k = c.find((x) => x.slug === it.slug && x.size === it.size && x.message === it.message)
    return k ? c.map((x) => (x === k ? { ...x, qty: Math.min(20, x.qty + it.qty) } : x)) : [...c, it]
  })
  const setQty = (i, q) => setCart((c) => c.map((x, n) => (n === i ? { ...x, qty: Math.max(1, Math.min(20, q)) } : x)))
  const remove = (i) => setCart((c) => c.filter((_, n) => n !== i))
  const clear = () => setCart([])

  return (
    <Ctx.Provider value={{ products, loading, error, find, price, lines, total, count, add, setQty, remove, clear, toast, setToast }}>
      {children}
    </Ctx.Provider>
  )
}

export const Arch = ({ p }) => (
  <div className="arch"><img src={asset(p.image)} alt={p.alt} loading="lazy" /></div>
)

export const WaBtn = ({ text, cls = 'btn wa' }) => (
  <a className={cls} target="_blank" rel="noopener noreferrer" href={`${WA}?text=${encodeURIComponent(text)}`}>Tanya admin (WhatsApp)</a>
)
