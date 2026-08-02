import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { marketAPI } from '../services/api';
import ProtectedLayout from '../components/layout/ProtectedLayout';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Hardware', 'Academic', 'Lifestyle', 'Electronics', 'Books', 'Clothing', 'Other'];

const FALLBACK = [
  { _id: '1', title: 'CUSTOM MECHANICAL KB', category: 'Hardware', price: 4500, condition: 'Like New', aiMatchScore: 98, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuC-dGd_RnpZMtBBDDDy3j6Iu-GbEV8ds_ZXd6BTwUOLRz4eHoC0vj2YZuRz7PBTjgdr8-2MAs7tHcUDhuU8_6OClpAFhp2wc9ffrotjI5R_pb5XJ6kVM0BASw0mD34HPo2i0yva-J4jF4haO0QmYKkD2esGm0yQeGb1UZJ0_DuxmpXxjHsJTLDb8D7BAxRJ3ITo0FMqhE_uIYuoAvYm319X7_ZJLU-lPBcwNd2mZefz7B_KW1o4061p6XW3ScLNIf6_5XZ-JE1qmGQd'], seller: { name: 'Aryan S.' }, status: 'available' },
  { _id: '2', title: 'LIMITED EDITION DROPS', category: 'Lifestyle', price: 2200, condition: 'New', aiMatchScore: 82, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBVpRZG9tDJyBHKvlj68daLwV0_w-5GhuVmRBkrfgBoWSiaS8-sGyvl0rPyt8vh5XzM8EUzggs5k3nXZLNtDDegVoCWkO-XfJM7vDop4K6SUdyCos5w4GymA6EAYu_rGkZw9H1S1WZ3asUs-1cMrp48B0zI7RVIX2hBKe4XMsuod5vLbGyJNdO_UXfPHaKwBVWBVWgcVy-k34Qfy5GFdoq8J5TcM060L0GqFBZsqcfnhCm-tEbIqZPOIPRZM2SmiFjEY26YhZN1tFpn'], seller: { name: 'Priya K.' }, status: 'available' },
  { _id: '3', title: 'DSA ADVANCED MASTERBOOK', category: 'Academic', price: 800, condition: 'Good', aiMatchScore: 75, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCTskGljpZF-zPFtB0PQ8ZtG8TCCMTN-r03-lIyLNoBgWIjADU3YEo79WMcdUwT2DspV4D5waFGGOlWEB_-cx3QMu6x2UrHuHNiyZfxolgiV2zni8vneSoJcP0eh5z0krsODV7E5qkpIJ39tsN3Sllx3Gh1Tq8P9mcrMibk-xRKj09KbDoiAmUxd8rkT_nlj45YClhjarpku7VeKhJkrbzcflb1aZh3S6aHMIynKHHeVbMh-eDmWGlTKvkXK1zcFLb9ftSlKNNnbGjT'], seller: { name: 'Rohan M.' }, status: 'available' },
  { _id: '4', title: 'NOISE CORE HEADSET PRO', category: 'Electronics', price: 12000, condition: 'Like New', aiMatchScore: 91, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBZxmk9lqqfPvTvQ9iZqUNUu73MoPhw-1TXMNgWoHeMzW6_a7bBKOwTuDpEVrNTjVaYWp8Op4vETpVFi7ST-QDjiLvuiCrqxQJHwtJz1yPPhGNQc9GNqm8iXPmwETgbn1meZbB2SSvyi-MlFjVE03T2ZCm2I_TbcTvs27Ctc6EKuvK80f_QKAvGcels3EbNK8FqU1iHSvkmtMtQppLBLZ5Yc8tnNPTZxuCtBSxlpenyLUqV3r3s_7idQdm34NyiuLvMOIvd6nsw4yCv'], seller: { name: 'Sneha R.' }, status: 'available' },
  { _id: '5', title: 'RTX 3060 GRAPHICS CARD', category: 'Hardware', price: 22000, condition: 'Good', aiMatchScore: 88, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBDofOioaNCF-Dq4RyTmpzGRRKlf6fhJAMhnMPl3qsKWppVKl4BZERIFpp-0lubDUkjOMd_w8Zqk5O-o71yAYo2QqoCGgWa4696gbdCu5oYzxywjlzUkuJ_7DTCy9JfvU669IXnkjonenS6fURRYbash9PJmJ5bT_tXaCSf7S7rDVNvq5p-8nJp5wA64KARG8jw2-JRkDlfm9ssnygir_9vF4TxHVnvwIYzGbCrrieqD8xi4u7OYzpIrZ4VWtU17LyXwgQXzhlOn_Me'], seller: { name: 'Vikram P.' }, status: 'available' },
  { _id: '6', title: 'REACT + NODE.JS COURSE', category: 'Academic', price: 500, condition: 'New', aiMatchScore: 95, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBAzkGj7s8ykNTzCT3rRHTXmBE5456MPRC0QTEjHw0PgMVBw1k6fEupz9Rmuz5N4IfWOFh_UgfFJ-tBpDg9M36M3ur34gl9tVH0-rUVOpGLTxmaz9Pi5tuuPwXGw9XINI2XZIOch1g4EbrqmcpmvWQEIJawJcEYKcVw-SwJ0r_GvmYBSvEd-Sqs1eSvkOeukaks4Ll3kcASh1V4_Qo3NlgnhBO_frXx9vmslBdmWpUupR-Wg3bT-Q6XbdnHW30zc0jgE4n9lIxKimwk'], seller: { name: 'Anjali D.' }, status: 'available' },
];

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showListingForm, setShowListingForm] = useState(false);
  const [newListing, setNewListing] = useState({ title: '', description: '', category: 'Hardware', price: '', condition: 'Good', imageUrl: '' });
  const [posting, setPosting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async (cat, q) => {
    setLoading(true);
    try {
      const params = {};
      if (cat && cat !== 'All') params.category = cat;
      if (q) params.search = q;
      const { data } = await marketAPI.getAll(params);
      setProducts(data.length > 0 ? data : FALLBACK);
    } catch { setProducts(FALLBACK); }
    finally { setLoading(false); }
  };

  const handleCategory = (cat) => { setActiveCategory(cat); fetchProducts(cat, search); };
  const handleSearch = (e) => { e.preventDefault(); fetchProducts(activeCategory, search); };

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setNewListing(prev => ({ ...prev, imageUrl: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setPosting(true);
    const imageSource = imagePreview || newListing.imageUrl || null;
    try {
      await marketAPI.create({ ...newListing, price: Number(newListing.price), images: imageSource ? [imageSource] : [] });
      toast.success('LISTING CREATED SUCCESSFULLY');
      setShowListingForm(false);
      setImagePreview(null);
      setNewListing({ title: '', description: '', category: 'Hardware', price: '', condition: 'Good', imageUrl: '' });
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally { setPosting(false); }
  };

  return (
    <ProtectedLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="font-mono text-label-mono text-secondary uppercase tracking-widest mb-1">CAMPUS ECONOMY</p>
            <h1 className="font-space text-4xl font-bold uppercase tracking-tighter">MARKETPLACE <span className="text-secondary">CORE</span></h1>
          </div>
          <button onClick={() => setShowListingForm(true)} className="btn-primary flex items-center gap-2 py-2.5 text-[11px] self-start">
            <span className="material-symbols-outlined text-lg">add</span>NEW LISTING
          </button>
        </div>

        {/* Search + Filters */}
        <div className="mb-6 space-y-3">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-grow max-w-lg">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input className="input-field pl-10" placeholder="SEARCH LISTINGS..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary py-2 px-5 text-[11px]">SCAN</button>
          </form>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => handleCategory(cat)}
                className={`tag border transition-all ${activeCategory === cat ? 'bg-secondary-container text-on-secondary border-secondary-container' : 'border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-72 bg-surface-container mechanical-border animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => (
              <Link key={p._id} to={`/marketplace/${p._id}`} className="mechanical-border bg-surface-container p-1 group pink-hover block">
                <div className="relative bg-[#0a0a0a] aspect-square mb-3">
                  <img src={p.images?.[0]} alt={p.title} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />
                  <div className="absolute top-2 left-2">
                    <span className="font-mono text-[9px] bg-surface-container border border-outline-variant text-on-surface-variant px-1.5 py-0.5 uppercase">{p.condition}</span>
                  </div>
                  {p.aiMatchScore > 0 && (
                    <div className="absolute bottom-2 right-2">
                      <span className="bg-secondary-container text-on-secondary font-mono text-[9px] px-2 py-0.5 uppercase">AI {p.aiMatchScore}%</span>
                    </div>
                  )}
                </div>
                <div className="px-3 pb-3">
                  <p className="font-mono text-[9px] text-on-surface-variant mb-0.5 uppercase">{p.category}</p>
                  <h4 className="font-mono text-[11px] uppercase mb-1 truncate text-on-surface">{p.title}</h4>
                  <p className="font-mono text-[9px] text-outline mb-2 uppercase">{p.seller?.name}</p>
                  <div className="flex items-center justify-between border-t border-outline-variant pt-2">
                    <span className="font-space text-lg font-bold text-primary-container">₹{p.price?.toLocaleString()}</span>
                    <button onClick={(e) => { e.preventDefault(); toast.success('Added to wishlist!'); }} className="material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors text-xl">favorite_border</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Create Listing Modal */}
        {showListingForm && (
          <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowListingForm(false)}>
            <div className="mechanical-border bg-surface-container w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-space text-xl font-bold uppercase">NEW LISTING</h2>
                <button onClick={() => setShowListingForm(false)} className="text-on-surface-variant hover:text-primary">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleCreateListing} className="space-y-4">
                <div><label className="font-mono text-label-mono text-outline uppercase block mb-1.5">Title</label><input required className="input-field" placeholder="Custom Mechanical Keyboard..." value={newListing.title} onChange={e => setNewListing({...newListing, title: e.target.value})} /></div>
                <div><label className="font-mono text-label-mono text-outline uppercase block mb-1.5">Description</label><textarea className="input-field h-20 resize-none" placeholder="Item details, condition notes..." value={newListing.description} onChange={e => setNewListing({...newListing, description: e.target.value})}></textarea></div>

                {/* Image Upload */}
                <div>
                  <label className="font-mono text-label-mono text-outline uppercase block mb-1.5">Product Image</label>
                  {/* Toggle */}
                  <div className="flex gap-1 mb-3">
                    {['upload','url'].map(mode => (
                      <button key={mode} type="button" onClick={() => setImageMode(mode)}
                        className={`font-mono text-[10px] uppercase px-3 py-1.5 border transition-all ${
                          imageMode === mode
                            ? 'bg-secondary-container text-on-secondary border-secondary-container'
                            : 'border-outline-variant text-outline hover:border-secondary'
                        }`}>
                        {mode === 'upload' ? '⬆ Upload File' : '🔗 Image URL'}
                      </button>
                    ))}
                  </div>

                  {imageMode === 'upload' ? (
                    <label className="block cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
                      {imagePreview ? (
                        <div className="relative group">
                          <img src={imagePreview} alt="preview" className="w-full h-36 object-cover border border-outline-variant" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="font-mono text-[10px] text-white uppercase">Click to change</span>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-outline-variant hover:border-secondary transition-colors h-28 flex flex-col items-center justify-center gap-2 text-outline">
                          <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                          <span className="font-mono text-[10px] uppercase">Click to upload image</span>
                          <span className="font-mono text-[9px] text-outline/60">JPG, PNG, WEBP · Max 5MB</span>
                        </div>
                      )}
                    </label>
                  ) : (
                    <div>
                      <input className="input-field" placeholder="https://example.com/image.jpg"
                        value={newListing.imageUrl}
                        onChange={e => {
                          setNewListing({...newListing, imageUrl: e.target.value});
                          setImagePreview(null);
                        }} />
                      {newListing.imageUrl && (
                        <img src={newListing.imageUrl} alt="preview"
                          className="mt-2 w-full h-28 object-cover border border-outline-variant"
                          onError={e => e.target.style.display='none'} />
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="font-mono text-label-mono text-outline uppercase block mb-1.5">Category</label>
                    <select className="input-field" value={newListing.category} onChange={e => setNewListing({...newListing, category: e.target.value})}>
                      {['Hardware','Academic','Lifestyle','Electronics','Books','Clothing','Other'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label className="font-mono text-label-mono text-outline uppercase block mb-1.5">Condition</label>
                    <select className="input-field" value={newListing.condition} onChange={e => setNewListing({...newListing, condition: e.target.value})}>
                      {['New','Like New','Good','Fair'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div><label className="font-mono text-label-mono text-outline uppercase block mb-1.5">Price (₹)</label><input required type="number" className="input-field" placeholder="2500" value={newListing.price} onChange={e => setNewListing({...newListing, price: e.target.value})} /></div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setShowListingForm(false); setImagePreview(null); }} className="btn-outline flex-1 py-2.5 text-[11px]">CANCEL</button>
                  <button type="submit" disabled={posting} className="btn-primary flex-1 py-2.5 text-[11px]">{posting ? 'POSTING...' : 'POST LISTING'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
