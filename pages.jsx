import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { api } from './api'
import { useShop, rp, SZ, STATUS, Arch, WaBtn } from './store'

const Card = ({ p }) => (
  <Link className="pc" to={`/produk/${p.slug}`}>
    <Arch p={p} /><h3>{p.name}</h3>
    <p><span className="tag">{p.category}</span></p>
    <p style={{ marginTop: 4 }}>mulai {rp(p.prices.S)}</p>
  </Link>
)
const Status = ({ loading, error }) =>
  loading ? <p className="mu" role="status">Memuat katalog…</p> : error ? <p className="note" role="alert">{error}</p> : null

export function Home() {
  const { products, loading, error } = useShop()
  const cats = [...new Set(products.map((p) => p.category))]
  return (<>
    <Status loading={loading} error={error} />
    {products[0] && <div className="hero"><div>
      <p className="eye">Toko bunga dan buket hadiah</p>
      <h1>Buket cantik untuk setiap <em>momen spesialmu</em></h1>
      <p className="lead">Pilih buket, tulis kartu ucapan, lalu atur tanggal kirim dalam beberapa langkah singkat.</p>
      <Link className="btn" to="/katalog">Lihat katalog</Link>
      <WaBtn text="Halo Diva Florist, saya mau tanya buket." cls="btn alt" />
    </div><Arch p={products[0]} /></div>}
    <section><div className="sh"><h2>Cari berdasarkan jenis</h2></div><div className="cats">
      {cats.map((c) => <Link key={c} className="cat" to={`/katalog?c=${encodeURIComponent(c)}`}><strong>{c}</strong><span className="mu">{products.filter((p) => p.category === c).length} produk</span></Link>)}
    </div></section>
    <section style={{ paddingTop: 8 }}><div className="sh"><h2>Koleksi kami</h2><Link className="lnk" to="/katalog">Lihat semua</Link></div>
      <div className="grid">{products.map((p) => <Card key={p.id} p={p} />)}</div></section>
    <div className="tri">
      <div><b>Tanggal dan jam kirim</b><span className="mu">Pilih sendiri saat checkout.</span></div>
      <div><b>Kartu ucapan</b><span className="mu">Tulis pesan dan lihat pratinjaunya.</span></div>
      <div><b>Tanya admin</b><span className="mu">Konsultasi lewat WhatsApp.</span></div>
    </div>
  </>)
}

export function Shop() {
  const { products, loading, error } = useShop()
  const loc = useLocation(), nav = useNavigate()
  const c = new URLSearchParams(loc.search).get('c') || ''
  const [q, setQ] = useState('')
  const cats = [...new Set(products.map((p) => p.category))]
  const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) && (!c || p.category === c))
  return (<section><h1>Katalog</h1>
    <p className="mu" style={{ margin: '8px 0 24px' }}>Pilih buket yang cocok untuk momenmu.</p>
    <div className="ctrl">
      <input type="search" placeholder="Cari nama buket" aria-label="Cari buket" value={q} onChange={(e) => setQ(e.target.value)} />
      <select aria-label="Jenis" value={c} onChange={(e) => nav(e.target.value ? `/katalog?c=${encodeURIComponent(e.target.value)}` : '/katalog')}>
        <option value="">Semua jenis</option>{cats.map((x) => <option key={x}>{x}</option>)}</select>
    </div>
    <Status loading={loading} error={error} />
    <p className="mu" aria-live="polite" style={{ marginBottom: 16 }}>{list.length} produk ditemukan</p>
    {list.length ? <div className="grid">{list.map((p) => <Card key={p.id} p={p} />)}</div>
      : !loading && <div className="empty"><h2>Belum ada yang cocok</h2><p>Coba ubah kata kunci atau hapus filter.</p><button className="btn alt" onClick={() => { setQ(''); nav('/katalog') }}>Hapus filter</button></div>}
  </section>)
}

export function Product() {
  const { slug } = useParams()
  const { find, add, setToast, loading } = useShop()
  const nav = useNavigate()
  const p = find(slug)
  const [size, setSize] = useState('M'), [qty, setQty] = useState(1), [msg, setMsg] = useState('')
  if (!p) return loading ? <p className="mu">Memuat…</p> : <section><div className="empty"><h2>Produk tidak ditemukan</h2><Link className="btn" to="/katalog">Lihat katalog</Link></div></section>
  return (<div className="pd"><Arch p={p} /><div>
    <Link className="lnk" to="/katalog">Kembali ke katalog</Link>
    <h1 style={{ fontSize: 'clamp(1.9rem,4vw,2.8rem)', marginTop: 8 }}>{p.name}</h1>
    <p style={{ marginTop: 6 }}><span className="tag">{p.category}</span></p>
    <div className="price">{rp(p.prices[size])}</div><p className="mu">{p.description}</p>
    <fieldset className="sz"><legend>Ukuran</legend>
      {Object.entries(SZ).map(([k, v]) => <label key={k}><input type="radio" name="sz" value={k} checked={size === k} onChange={() => setSize(k)} /><span>{v}</span></label>)}
    </fieldset>
    <div style={{ marginBottom: 18 }}><label>Jumlah</label><div className="qty">
      <button aria-label="Kurangi jumlah" onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span>{qty}</span>
      <button aria-label="Tambah jumlah" onClick={() => setQty(Math.min(20, qty + 1))}>+</button></div></div>
    <label htmlFor="msg">Kartu ucapan <span className="mu">(opsional)</span></label>
    <textarea id="msg" rows="3" maxLength="120" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Contoh: Selamat ulang tahun, semoga harimu menyenangkan!" />
    <div className="card" aria-label="Pratinjau kartu">{msg ? `“${msg}”` : 'Pratinjau pesanmu akan tampil di sini.'}</div>
    <p className="mu" style={{ fontSize: '.85rem', margin: '4px 0 20px' }}>{msg.length}/120 karakter</p>
    <div className="pd"><button className="btn" onClick={() => { add({ slug: p.slug, size, qty, message: msg.trim() }); setToast('Ditambahkan ke keranjang'); nav('/keranjang') }}>Tambah ke keranjang</button>{' '}
      <WaBtn text={`Halo Diva Florist, saya mau tanya ${p.name}.`} /></div>
  </div></div>)
}

export function Cart() {
  const { lines, total, count, setQty, remove, setToast } = useShop()
  if (!lines.length) return <section><div className="empty"><h2>Keranjang masih kosong</h2><p>Pilih buket favoritmu dulu, lalu kembali ke sini.</p><Link className="btn" to="/katalog">Lihat katalog</Link></div></section>
  return (<div className="two"><div><h1 style={{ fontSize: '2.3rem', marginBottom: 8 }}>Keranjang</h1>
    {lines.map((l) => <div className="row" key={l.i}><Arch p={l.p} /><div>
      <h3>{l.p.name}</h3><p className="mu">Ukuran {SZ[l.size]}</p>
      {l.message && <p className="mu" style={{ fontSize: '.9rem' }}>Kartu: “{l.message}”</p>}
      <div className="qty" style={{ marginTop: 8 }}>
        <button aria-label={`Kurangi jumlah ${l.p.name}`} onClick={() => setQty(l.i, l.qty - 1)}>−</button><span>{l.qty}</span>
        <button aria-label={`Tambah jumlah ${l.p.name}`} onClick={() => setQty(l.i, l.qty + 1)}>+</button></div>{' '}
      <button className="lnk" onClick={() => { remove(l.i); setToast(`${l.p.name} dihapus dari keranjang`) }}>Hapus</button></div>
      <strong>{rp(l.p.prices[l.size] * l.qty)}</strong></div>)}
  </div>
  <aside className="box sum"><h2 style={{ marginBottom: 12 }}>Ringkasan</h2>
    <div><span>{count} item</span><span>{rp(total)}</span></div>
    <p className="mu" style={{ fontSize: '.9rem' }}>Ongkir dikonfirmasi admin.</p>
    <Link className="btn" style={{ width: '100%', marginTop: 14, textAlign: 'center' }} to="/checkout">Lanjut ke checkout</Link></aside></div>)
}

const hp = /^(\+62|62|0)8\d{7,11}$/
const EMPTY = { sender_name: '', sender_phone: '', receiver_name: '', receiver_phone: '', address: '', delivery_date: '', delivery_slot: '' }
export const SLOT = ['09.00–12.00', '12.00–15.00', '15.00–18.00']

export function Checkout() {
  const { lines, total, clear, setToast } = useShop()
  const nav = useNavigate()
  const [f, setF] = useState(EMPTY), [er, setEr] = useState({}), [busy, setBusy] = useState(false)
  const t = new Date(); t.setDate(t.getDate() + 1)
  const min = t.toLocaleDateString('sv-SE')
  useEffect(() => { if (!lines.length) nav('/keranjang', { replace: true }) }, [lines.length])
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const fd = (k, label, props = {}) => (<div className="f"><label htmlFor={k}>{label}</label>
    <input id={k} value={f[k]} onChange={set(k)} aria-invalid={er[k] ? 'true' : undefined} aria-describedby={`e-${k}`} {...props} />
    <small className="err" id={`e-${k}`}>{er[k]}</small></div>)

  async function submit(e) {
    e.preventDefault()
    const v = {
      sender_name: f.sender_name.trim() ? '' : 'Isi nama pengirim.',
      sender_phone: hp.test(f.sender_phone.replace(/[\s-]/g, '')) ? '' : 'Isi nomor HP yang valid, contoh 081234567890.',
      receiver_name: f.receiver_name.trim() ? '' : 'Isi nama penerima.',
      receiver_phone: hp.test(f.receiver_phone.replace(/[\s-]/g, '')) ? '' : 'Isi nomor HP penerima yang valid.',
      address: f.address.trim().length >= 15 ? '' : 'Tulis alamat lengkap dengan jalan, nomor, dan kota (minimal 15 karakter).',
      delivery_date: f.delivery_date && f.delivery_date >= min ? '' : 'Pilih tanggal kirim mulai besok.',
      delivery_slot: f.delivery_slot ? '' : 'Pilih jam pengiriman.',
    }
    const bad = Object.keys(v).filter((k) => v[k])
    setEr(v)
    if (bad.length) { document.getElementById(bad[0])?.focus(); setToast('Ada isian yang perlu diperbaiki'); return }
    setBusy(true)
    try {
      const r = await api.post('/orders', { ...f, items: lines.map((l) => ({ slug: l.slug, size: l.size, qty: l.qty, message: l.message || null })) })
      clear(); nav(`/pesanan/${r.data.order_number}`, { state: { fresh: true } })
    } catch (x) {
      const s = x.response?.data?.errors
      if (s) setEr(Object.fromEntries(Object.entries(s).map(([k, m]) => [k, m[0]])))
      setToast(s ? 'Ada isian yang perlu diperbaiki' : 'Gagal membuat pesanan. Coba lagi.')
    } finally { setBusy(false) }
  }

  return (<div className="two"><form noValidate onSubmit={submit}>
    <h1 style={{ fontSize: '2.3rem', marginBottom: 16 }}>Isi data penerima</h1>
    <h2 style={{ fontSize: '1.4rem', marginBottom: 12 }}>Pengirim</h2>
    <div className="f2">{fd('sender_name', 'Nama pengirim', { autoComplete: 'name' })}{fd('sender_phone', 'Nomor HP pengirim', { inputMode: 'tel', placeholder: '08xxxxxxxxxx' })}</div>
    <h2 style={{ fontSize: '1.4rem', margin: '8px 0 12px' }}>Penerima</h2>
    <div className="f2">{fd('receiver_name', 'Nama penerima')}{fd('receiver_phone', 'Nomor HP penerima', { inputMode: 'tel', placeholder: '08xxxxxxxxxx' })}</div>
    <div className="f"><label htmlFor="address">Alamat lengkap</label>
      <textarea id="address" rows="3" value={f.address} onChange={set('address')} aria-invalid={er.address ? 'true' : undefined} />
      <small className="err">{er.address}</small></div>
    <h2 style={{ fontSize: '1.4rem', margin: '8px 0 12px' }}>Tanggal kirim</h2>
    <div className="f2">{fd('delivery_date', 'Tanggal', { type: 'date', min })}
      <div className="f"><label htmlFor="delivery_slot">Jam</label>
        <select id="delivery_slot" value={f.delivery_slot} onChange={set('delivery_slot')} aria-invalid={er.delivery_slot ? 'true' : undefined}>
          <option value="">Pilih jam</option>{SLOT.map((s) => <option key={s}>{s}</option>)}</select>
        <small className="err">{er.delivery_slot}</small></div></div>
    <button className="btn" type="submit" disabled={busy}>{busy ? 'Memproses…' : 'Buat pesanan'}</button>{' '}
    <Link className="btn alt" to="/keranjang">Kembali ke keranjang</Link></form>
    <aside className="box sum"><h2 style={{ marginBottom: 12 }}>Pesananmu</h2>
      {lines.map((l) => <div key={l.i}><span>{l.p.name} ({SZ[l.size]}) × {l.qty}</span><span>{rp(l.p.prices[l.size] * l.qty)}</span></div>)}
      <div className="t"><span>Total</span><span>{rp(total)}</span></div>
      <p className="mu" style={{ fontSize: '.88rem', marginTop: 8 }}>Instruksi pembayaran dikirim admin lewat WhatsApp setelah pesanan diterima.</p></aside></div>)
}

export function Order() {
  const { no } = useParams()
  const fresh = useLocation().state?.fresh
  const [o, setO] = useState(null), [err, setErr] = useState('')
  useEffect(() => { api.get(`/orders/${no}`).then((r) => setO(r.data)).catch(() => setErr('Nomor pesanan tidak ditemukan.')) }, [no])
  if (err) return <section><div className="empty"><h2>{err}</h2><Link className="btn" to="/lacak">Coba lagi</Link></div></section>
  if (!o) return <p className="mu" role="status">Memuat pesanan…</p>
  const flow = ['pending', 'processing', 'shipped', 'done'], at = flow.indexOf(o.status)
  return (<section style={{ maxWidth: 680 }}>
    <h1>{fresh ? 'Pesanan diterima' : 'Status pesanan'}</h1>
    <p style={{ margin: '14px 0 6px' }}>{fresh && `Terima kasih, ${o.sender_name}. `}Nomor pesanan <strong>{o.order_number}</strong> untuk {o.receiver_name}, dikirim {new Date(o.delivery_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} pukul {o.delivery_slot}.</p>
    {o.status === 'cancelled' ? <p className="note" style={{ margin: '18px 0' }}>Pesanan ini dibatalkan.</p>
      : <ol className="steps" aria-label="Status pesanan">{flow.map((s, i) => <li key={s} className={i <= at ? 'on' : ''}>{STATUS[s]}</li>)}</ol>}
    <div className="box sum">{o.items.map((i) => <div key={i.id}><span>{i.product_name} ({SZ[i.size]}) × {i.qty}</span><span>{rp(i.price * i.qty)}</span></div>)}
      <div className="t"><span>Total</span><span>{rp(o.total)}</span></div></div>
    <p className="note" style={{ margin: '18px 0' }}>Simpan nomor pesanan ini untuk melacak status kapan saja.</p>
    <WaBtn text={`Halo Diva Florist, saya mau tanya pesanan ${o.order_number}.`} /> <Link className="btn alt" to="/katalog">Belanja lagi</Link></section>)
}

export function Track() {
  const nav = useNavigate(), [no, setNo] = useState('')
  return (<section style={{ maxWidth: 520 }}><h1>Lacak Pesanan</h1>
    <form className="f" style={{ marginTop: 20 }} onSubmit={(e) => { e.preventDefault(); no.trim() && nav(`/pesanan/${no.trim().toUpperCase()}`) }}>
      <label htmlFor="no">Nomor pesanan</label><input id="no" value={no} onChange={(e) => setNo(e.target.value)} placeholder="DF-XXXXXX" />
      <button className="btn" style={{ marginTop: 14 }}>Cek status</button></form></section>)
}

export function Info() {
  return (<section style={{ maxWidth: 760 }}><h1>Cara Pesan</h1>
    <ol className="steps">{['1. Pilih buket di katalog', '2. Pilih ukuran dan tulis kartu', '3. Masukkan keranjang', '4. Isi data penerima', '5. Pilih tanggal kirim'].map((s) => <li key={s}>{s}</li>)}</ol>
    <h2 id="kontak" style={{ margin: '36px 0 8px' }}>Kontak</h2>
    <p className="mu" style={{ marginBottom: 16 }}>Hubungi admin untuk konsultasi, buket custom, atau pesanan mendadak. Nomor dan jam operasional masih contoh.</p>
    <WaBtn text="Halo Diva Florist, saya mau konsultasi." />
    <h2 style={{ margin: '36px 0 8px' }}>Pertanyaan umum</h2>
    <details><summary>Berapa lama pesanan disiapkan?</summary><p>Isi dengan kebijakan asli toko.</p></details>
    <details><summary>Area mana saja yang dilayani?</summary><p>Isi dengan area pengiriman asli.</p></details>
    <details><summary>Bisa memesan buket custom?</summary><p>Hubungi admin lewat WhatsApp untuk konsultasi.</p></details></section>)
}
