// MODE DEMO: dipakai otomatis saat website dipublish tanpa backend (mis. GitHub Pages).
// Data produk bawaan + pesanan disimpan di browser (localStorage), bukan di server.
const PRODUCTS = [
  { id: 1, slug: 'p1', name: 'Buket Mawar Satin Merah', category: 'Buket Bunga', image: '/img/p1.jpg', is_active: true,
    alt: 'Buket mawar satin merah dengan satu mawar merah muda di tengah',
    description: 'Rangkaian mawar satin merah dengan satu mawar merah muda di tengah dan sentuhan baby’s breath, dibungkus kertas abu-abu dan mesh merah muda dengan pita merah.',
    prices: { S: 150000, M: 250000, L: 400000 } },
  { id: 2, slug: 'p2', name: 'Buket Uang Biru', category: 'Buket Uang', image: '/img/p2.jpg', is_active: true,
    alt: 'Buket uang dengan pembungkus biru muda dan pita emas',
    description: 'Contoh buket uang dengan lembaran Rp100.000 yang ditata menyebar, pembungkus biru muda, dan pita emas.',
    prices: { S: 200000, M: 350000, L: 600000 } },
  { id: 3, slug: 'p3', name: 'Buket Uang Putih', category: 'Buket Uang', image: '/img/p3.jpg', is_active: true,
    alt: 'Buket uang dengan pembungkus putih bermotif hati dan pita ungu',
    description: 'Contoh buket uang dengan lembaran Rp10.000, pembungkus putih bermotif hati, pita ungu, dan bunga kuning di bagian bawah.',
    prices: { S: 180000, M: 300000, L: 500000 } },
]

const KEY = 'dv-demo-orders'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }
const save = (o) => { try { localStorage.setItem(KEY, JSON.stringify(o)) } catch {} }
const ok = (config, data, status = 200) => Promise.resolve({ data, status, statusText: 'OK', headers: {}, config })
const fail = (status, data) => { const e = new Error('demo'); e.response = { status, data }; return Promise.reject(e) }
const code = () => Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('')

// Pengganti axios adapter: menjawab request /api/... dari data di atas
export function demoAdapter(config) {
  const method = (config.method || 'get').toLowerCase()
  const url = config.url || ''

  if (method === 'get' && url === '/products') return ok(config, { data: PRODUCTS })

  if (method === 'post' && url === '/orders') {
    const d = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
    let total = 0
    const items = []
    for (const [n, i] of (d.items || []).entries()) {
      const p = PRODUCTS.find((x) => x.slug === i.slug)
      if (!p || !p.prices[i.size]) return fail(422, { errors: { items: ['Produk tidak valid.'] } })
      total += p.prices[i.size] * i.qty
      items.push({ id: n + 1, product_name: p.name, size: i.size, price: p.prices[i.size], qty: i.qty, card_message: i.message || null })
    }
    const order = { id: Date.now(), order_number: 'DF-' + code(), status: 'pending', total, items,
      sender_name: d.sender_name, sender_phone: d.sender_phone, receiver_name: d.receiver_name, receiver_phone: d.receiver_phone,
      address: d.address, delivery_date: d.delivery_date, delivery_slot: d.delivery_slot }
    save([order, ...load()])
    return ok(config, order, 201)
  }

  const m = url.match(/^\/orders\/(.+)$/)
  if (method === 'get' && m) {
    const o = load().find((x) => x.order_number === decodeURIComponent(m[1]).toUpperCase())
    return o ? ok(config, o) : fail(404, { message: 'Tidak ditemukan' })
  }

  if (url.startsWith('/admin')) return fail(422, { message: 'Mode demo: dashboard admin hanya tersedia dengan backend Laravel.' })
  return fail(404, { message: 'Tidak ditemukan' })
}
