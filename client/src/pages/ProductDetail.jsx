import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { marketAPI } from '../services/api';
import ProtectedLayout from '../components/layout/ProtectedLayout';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FALLBACK = {
  _id: '1', title: 'CUSTOM MECHANICAL KEYBOARD', category: 'Hardware', price: 4500,
  condition: 'Like New', description: 'Cherry MX Brown switches. Custom cyan and dark gray keycaps. Bought 6 months ago, barely used. Comes with original box and USB-C cable. Perfect for coders and gamers.',
  images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuC-dGd_RnpZMtBBDDDy3j6Iu-GbEV8ds_ZXd6BTwUOLRz4eHoC0vj2YZuRz7PBTjgdr8-2MAs7tHcUDhuU8_6OClpAFhp2wc9ffrotjI5R_pb5XJ6kVM0BASw0mD34HPo2i0yva-J4jF4haO0QmYKkD2esGm0yQeGb1UZJ0_DuxmpXxjHsJTLDb8D7BAxRJ3ITo0FMqhE_uIYuoAvYm319X7_ZJLU-lPBcwNd2mZefz7B_KW1o4061p6XW3ScLNIf6_5XZ-JE1qmGQd'],
  seller: { name: 'Aryan Sharma', email: 'aryan@example.com', branch: 'B.Tech CS', year: 3 },
  views: 142, aiMatchScore: 98, status: 'available', tags: ['keyboard', 'hardware', 'peripherals'],
};

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    marketAPI.getById(id)
      .then(r => setProduct(r.data))
      .catch(() => setProduct(FALLBACK))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await marketAPI.remove(id);
      toast.success('LISTING DELETED');
      navigate('/marketplace');
    } catch {
      toast.error('Failed to delete listing');
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  // Check if logged-in user is the seller
  const isSeller = user && product &&
    (product.seller?._id === user._id ||
     product.seller?.name === user.name);

  if (loading) return <ProtectedLayout><div className="p-6"><div className="h-96 bg-surface-container mechanical-border animate-pulse"></div></div></ProtectedLayout>;

  const p = product || FALLBACK;

  return (
    <ProtectedLayout>
      <div className="p-6">
        <Link to="/marketplace" className="font-mono text-label-mono text-outline hover:text-primary flex items-center gap-1 uppercase mb-6">
          <span className="material-symbols-outlined text-sm">arrow_back</span>BACK TO MARKETPLACE
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-3">
            <div className="mechanical-border bg-[#0a0a0a] aspect-square overflow-hidden">
              <img src={p.images?.[selectedImg]} alt={p.title} className="w-full h-full object-contain p-8" />
            </div>
            {p.images?.length > 1 && (
              <div className="flex gap-2">
                {p.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)} className={`w-16 h-16 mechanical-border overflow-hidden ${selectedImg === i ? 'border-primary-container' : ''}`}>
                    <img src={img} alt="" className="w-full h-full object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="tag border border-outline-variant text-on-surface-variant">{p.category}</span>
                <span className="tag border border-outline-variant text-on-surface-variant">{p.condition}</span>
                {p.aiMatchScore > 0 && <span className="tag bg-secondary-container text-on-secondary">AI {p.aiMatchScore}% MATCH</span>}
              </div>
              <h1 className="font-space text-3xl font-bold uppercase tracking-tighter">{p.title}</h1>
              <p className="font-space text-4xl font-bold text-primary-container mt-3">₹{p.price?.toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px] text-outline uppercase">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">visibility</span>{p.views} VIEWS</span>
              <span className="w-px h-4 bg-outline-variant"></span>
              <span className={`flex items-center gap-1 ${p.status === 'available' ? 'text-primary' : 'text-error'}`}>
                <span className="material-symbols-outlined text-sm">{p.status === 'available' ? 'check_circle' : 'cancel'}</span>
                {p.status?.toUpperCase()}
              </span>
            </div>

            <div className="mechanical-border bg-surface-container p-5">
              <h3 className="font-mono text-nav-mono text-on-surface-variant uppercase mb-3">ITEM DESCRIPTION</h3>
              <p className="font-body text-body-sm text-on-surface leading-relaxed">{p.description}</p>
            </div>

            {/* Seller */}
            <div className="mechanical-border bg-surface-container p-5">
              <h3 className="font-mono text-nav-mono text-on-surface-variant uppercase mb-4">SELLER INFO</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 border border-primary flex items-center justify-center text-primary font-space font-bold text-lg">
                  {p.seller?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-space font-bold uppercase">{p.seller?.name}</p>
                  <p className="font-mono text-[10px] text-outline uppercase">{p.seller?.branch} / Yr {p.seller?.year}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {isSeller ? (
                <>
                  <div className="mechanical-border bg-surface-container/50 border-primary/30 p-4">
                    <p className="font-mono text-[10px] text-primary-container uppercase flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-sm">storefront</span>
                      YOUR LISTING
                    </p>
                    {!showConfirm ? (
                      <button onClick={() => setShowConfirm(true)}
                        className="w-full py-3 border border-error text-error font-mono text-[11px] uppercase flex items-center justify-center gap-2 hover:bg-error hover:text-on-error transition-all">
                        <span className="material-symbols-outlined text-sm">delete</span>
                        DELETE LISTING
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <p className="font-mono text-[10px] text-error uppercase text-center">Confirm deletion? This cannot be undone.</p>
                        <div className="flex gap-2">
                          <button onClick={() => setShowConfirm(false)}
                            className="flex-1 py-2.5 border border-outline-variant text-on-surface-variant font-mono text-[11px] uppercase hover:border-outline transition-all">
                            CANCEL
                          </button>
                          <button onClick={handleDelete} disabled={deleting}
                            className="flex-1 py-2.5 bg-error text-on-error font-mono text-[11px] uppercase flex items-center justify-center gap-1 disabled:opacity-50">
                            {deleting ? <><span className="material-symbols-outlined text-sm animate-spin">refresh</span>DELETING...</> : <><span className="material-symbols-outlined text-sm">delete_forever</span>CONFIRM</>}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  {/* BUY NOW */}
                  <button onClick={() => { toast.success('Purchase request sent! Seller will confirm shortly.'); }}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-[13px] font-bold">
                    <span className="material-symbols-outlined">shopping_bag</span>BUY NOW — ₹{p.price?.toLocaleString()}
                  </button>

                  {/* MAKE OFFER */}
                  <button onClick={() => { setShowOffer(true); setOfferPrice(''); }}
                    className="w-full py-3.5 border-2 border-primary-container text-primary-container font-mono text-[12px] uppercase flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary transition-all">
                    <span className="material-symbols-outlined text-sm">local_offer</span>MAKE AN OFFER
                  </button>

                  {/* CONTACT SELLER */}
                  <button onClick={() => { setShowContact(true); setContactMsg(''); }}
                    className="btn-outline w-full py-3.5 flex items-center justify-center gap-2 text-[12px]">
                    <span className="material-symbols-outlined text-sm">chat</span>CONTACT SELLER
                  </button>

                  {/* WISHLIST + REPORT row */}
                  <div className="flex gap-2">
                    <button onClick={() => { setWishlist(w => !w); toast.success(wishlist ? 'Removed from wishlist' : 'Saved to wishlist!'); }}
                      className={`flex-1 py-2.5 border font-mono text-[11px] uppercase flex items-center justify-center gap-1.5 transition-all ${
                        wishlist ? 'border-secondary bg-secondary/10 text-secondary' : 'border-outline-variant text-outline hover:border-secondary hover:text-secondary'
                      }`}>
                      <span className="material-symbols-outlined text-sm">{wishlist ? 'favorite' : 'favorite_border'}</span>
                      {wishlist ? 'SAVED' : 'WISHLIST'}
                    </button>
                    <button onClick={() => toast.error('Report submitted. We\'ll review this listing.')}
                      className="flex-1 py-2.5 border border-outline-variant text-outline font-mono text-[11px] uppercase flex items-center justify-center gap-1.5 hover:border-error hover:text-error transition-all">
                      <span className="material-symbols-outlined text-sm">flag</span>REPORT
                    </button>
                  </div>

                  {/* Safe Deal note */}
                  <div className="bg-surface-container border border-outline-variant p-3 flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">verified_user</span>
                    <p className="font-mono text-[9px] text-on-surface-variant uppercase leading-relaxed">
                      Always meet in a safe public place. Never transfer money before seeing the item in person.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAKE AN OFFER MODAL */}
      {showOffer && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowOffer(false)}>
          <div className="mechanical-border bg-surface-container w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-space text-lg font-bold uppercase">Make an Offer</h2>
              <button onClick={() => setShowOffer(false)} className="text-outline hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="mb-2">
              <p className="font-mono text-[10px] text-outline uppercase mb-1">Listed Price</p>
              <p className="font-space text-2xl font-bold text-primary-container">₹{p.price?.toLocaleString()}</p>
            </div>
            <div className="my-4">
              <label className="font-mono text-label-mono text-outline uppercase block mb-2">Your Offer (₹)</label>
              <input type="number" className="input-field" placeholder={p.price} value={offerPrice}
                onChange={e => setOfferPrice(e.target.value)} autoFocus />
              {offerPrice && Number(offerPrice) < p.price && (
                <p className="font-mono text-[9px] text-secondary mt-1 uppercase">
                  ↓ {Math.round((1 - offerPrice / p.price) * 100)}% below asking price
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowOffer(false)} className="btn-outline flex-1 py-3 text-[11px]">CANCEL</button>
              <button onClick={() => {
                if (!offerPrice) return toast.error('Enter an offer price');
                toast.success(`Offer of ₹${Number(offerPrice).toLocaleString()} sent to ${p.seller?.name}!`);
                setShowOffer(false);
              }} className="btn-primary flex-1 py-3 text-[11px] flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">send</span>SEND OFFER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT SELLER MODAL */}
      {showContact && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowContact(false)}>
          <div className="mechanical-border bg-surface-container w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-space text-lg font-bold uppercase">Contact Seller</h2>
              <button onClick={() => setShowContact(false)} className="text-outline hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {/* Seller mini card */}
            <div className="flex items-center gap-3 bg-surface-container-high p-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 border border-primary flex items-center justify-center text-primary font-space font-bold">
                {p.seller?.name?.charAt(0)}
              </div>
              <div>
                <p className="font-space font-bold uppercase text-sm">{p.seller?.name}</p>
                <p className="font-mono text-[9px] text-outline uppercase">{p.seller?.branch} / Yr {p.seller?.year}</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="font-mono text-label-mono text-outline uppercase block mb-2">Your Message</label>
              <textarea rows={4} className="input-field resize-none"
                placeholder={`Hi ${p.seller?.name?.split(' ')[0]}, I'm interested in your ${p.title}. Is it still available?`}
                value={contactMsg} onChange={e => setContactMsg(e.target.value)} autoFocus />
            </div>
            {/* Quick replies */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                'Is this still available?',
                'Can you do ₹' + Math.round(p.price * 0.9).toLocaleString() + '?',
                'Can we meet on campus?',
              ].map(q => (
                <button key={q} type="button" onClick={() => setContactMsg(q)}
                  className="font-mono text-[9px] text-on-surface-variant border border-outline-variant px-2 py-1 hover:border-primary hover:text-primary transition-all uppercase">
                  {q}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowContact(false)} className="btn-outline flex-1 py-3 text-[11px]">CANCEL</button>
              <button onClick={() => {
                if (!contactMsg.trim()) return toast.error('Write a message first');
                toast.success(`Message sent to ${p.seller?.name}!`);
                setShowContact(false);
              }} className="btn-primary flex-1 py-3 text-[11px] flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">send</span>SEND
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedLayout>
  );
}
