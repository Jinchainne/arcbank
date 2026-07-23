import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop, type DeliveryAddress } from '../../hooks/useShop';
import { ArrowLeft, MapPin, Navigation, Truck, Search, X, Loader2 } from 'lucide-react';

const MAP_SCRIPT = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const MAP_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

const DEFAULT_LAT = 10.8231;
const DEFAULT_LNG = 106.6297;

function calcShippingFee(lat: number, lng: number): number {
  const shopLat = 10.7769;
  const shopLng = 106.7009;
  const R = 6371;
  const dLat = ((lat - shopLat) * Math.PI) / 180;
  const dLng = ((lng - shopLng) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((shopLat * Math.PI) / 180) * Math.cos((lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.min(8, Math.round((1.5 + km * 0.5) * 100) / 100);
}

interface GeoResult {
  name: string;
  lat: number;
  lng: number;
  display_name: string;
}

// Hardcoded popular Vietnamese locations for instant results
const POPULAR_LOCATIONS: GeoResult[] = [
  { name: 'Ho Chi Minh City', lat: 10.8231, lng: 106.6297, display_name: 'Ho Chi Minh City, Vietnam' },
  { name: 'Hanoi', lat: 21.0285, lng: 105.8542, display_name: 'Hanoi, Vietnam' },
  { name: 'Da Nang', lat: 16.0544, lng: 108.2022, display_name: 'Da Nang, Vietnam' },
  { name: 'Nha Trang', lat: 12.2388, lng: 109.1967, display_name: 'Nha Trang, Khanh Hoa, Vietnam' },
  { name: 'Hue', lat: 16.4637, lng: 107.5909, display_name: 'Hue, Thua Thien Hue, Vietnam' },
  { name: 'Da Lat', lat: 11.9404, lng: 108.4583, display_name: 'Da Lat, Lam Dong, Vietnam' },
  { name: 'Can Tho', lat: 10.0452, lng: 105.7469, display_name: 'Can Tho, Vietnam' },
  { name: 'Hai Phong', lat: 20.8449, lng: 106.6881, display_name: 'Hai Phong, Vietnam' },
  { name: 'Vung Tau', lat: 10.3460, lng: 107.0840, display_name: 'Vung Tau, Ba Ria-Vung Tau, Vietnam' },
  { name: 'Phu Quoc', lat: 10.2270, lng: 103.9660, display_name: 'Phu Quoc Island, Kien Giang, Vietnam' },
  { name: 'Quy Nhon', lat: 13.7560, lng: 109.2180, display_name: 'Quy Nhon, Binh Dinh, Vietnam' },
  { name: 'Buon Ma Thuot', lat: 12.6660, lng: 108.0380, display_name: 'Buon Ma Thuot, Dak Lak, Vietnam' },
  { name: 'District 1, HCMC', lat: 10.7769, lng: 106.7009, display_name: 'District 1, Ho Chi Minh City, Vietnam' },
  { name: 'District 7, HCMC', lat: 10.7290, lng: 106.7180, display_name: 'District 7, Ho Chi Minh City, Vietnam' },
  { name: 'Tan Binh, HCMC', lat: 10.8015, lng: 106.6530, display_name: 'Tan Binh District, Ho Chi Minh City, Vietnam' },
  { name: 'Binh Thanh, HCMC', lat: 10.8070, lng: 106.7100, display_name: 'Binh Thanh District, Ho Chi Minh City, Vietnam' },
  { name: 'Thu Duc, HCMC', lat: 10.8700, lng: 106.7700, display_name: 'Thu Duc City, Ho Chi Minh City, Vietnam' },
];

export default function DeliveryPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, cartCount } = useShop();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [position, setPosition] = useState({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchTimeoutRef = useRef<any>(null);

  const shippingFee = calcShippingFee(position.lat, position.lng);
  const grandTotal = cartTotal + shippingFee;

  // Reverse geocode: coordinates → address
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: { 'Accept-Language': 'en' }
      });
      const data = await resp.json();
      if (data.display_name) {
        setAddress(data.display_name);
        setSearchQuery(data.display_name);
      }
    } catch {
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  }, []);

  // Search addresses - instant local match + Nominatim fallback
  const searchAddress = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const q = query.toLowerCase();

    // Instant: match from popular locations
    const localMatches = POPULAR_LOCATIONS.filter(loc =>
      loc.name.toLowerCase().includes(q) || loc.display_name.toLowerCase().includes(q)
    );

    if (localMatches.length > 0) {
      setSuggestions(localMatches);
      setShowSuggestions(true);
    }

    // Also try Nominatim for more specific addresses
    setSearching(true);
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=vn`, {
        headers: { 'Accept-Language': 'en' }
      });
      const data = await resp.json();
      if (data.length > 0) {
        const results: GeoResult[] = data.map((item: any) => ({
          name: item.display_name.split(',')[0],
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          display_name: item.display_name,
        }));
        // Merge with local results, dedupe by name
        const merged = [...localMatches];
        results.forEach(r => {
          if (!merged.find(m => m.name === r.name)) merged.push(r);
        });
        setSuggestions(merged.slice(0, 8));
        setShowSuggestions(true);
      }
    } catch {
      // Local results already shown
    } finally {
      setSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      searchAddress(searchQuery);
    }, 300);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery, searchAddress]);

  // Select suggestion → move map + pin
  const selectSuggestion = useCallback((s: GeoResult) => {
    setPosition({ lat: s.lat, lng: s.lng });
    setAddress(s.display_name);
    setSearchQuery(s.name);
    setShowSuggestions(false);
    setSuggestions([]);
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([s.lat, s.lng], 15);
      markerRef.current.setLatLng([s.lat, s.lng]);
    }
    // Reverse geocode to get full address
    setTimeout(() => reverseGeocode(s.lat, s.lng), 500);
  }, [reverseGeocode]);

  // Load Leaflet
  useEffect(() => {
    if (mapReady) return;
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = MAP_CSS;
      document.head.appendChild(link);
    }
    if (!(window as any).L) {
      const script = document.createElement('script');
      script.src = MAP_SCRIPT;
      script.onload = () => setMapReady(true);
      document.head.appendChild(script);
    } else {
      setMapReady(true);
    }
  }, []);

  // Init map
  useEffect(() => {
    if (!mapReady || !mapRef.current || mapInstanceRef.current) return;
    const L = (window as any).L;
    const map = L.map(mapRef.current).setView([DEFAULT_LAT, DEFAULT_LNG], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const marker = L.marker([DEFAULT_LAT, DEFAULT_LNG], { draggable: true }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      setPosition({ lat: pos.lat, lng: pos.lng });
      reverseGeocode(pos.lat, pos.lng);
    });

    map.on('click', (e: any) => {
      marker.setLatLng(e.latlng);
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;
    reverseGeocode(DEFAULT_LAT, DEFAULT_LNG);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          map.setView([lat, lng], 16);
          marker.setLatLng([lat, lng]);
          setPosition({ lat, lng });
          reverseGeocode(lat, lng);
        },
        () => {}
      );
    }
  }, [mapReady, reverseGeocode]);

  const handleConfirm = () => {
    const delivery: DeliveryAddress = { lat: position.lat, lng: position.lng, address, note };
    sessionStorage.setItem('arcbank_delivery', JSON.stringify(delivery));
    sessionStorage.setItem('arcbank_shipping_fee', shippingFee.toString());
    navigate('/shop/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-lg mx-auto px-4 py-8 text-center">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">Your cart is empty</p>
          <button onClick={() => navigate('/shop')} className="btn-primary">Browse Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => navigate('/shop')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </button>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Delivery Address</h1>
        <p className="text-sm text-slate-400 mb-4">Search or tap on map to set your location</p>

        {/* Address Search with Autocomplete */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
          <input
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => { if (searchQuery.length >= 2) setShowSuggestions(true); }}
            placeholder="Type city or address (e.g. Nha Trang, Da Nang...)"
            className="pl-10 pr-10 w-full"
            autoComplete="off"
          />
          {searching && (
            <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
          )}
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setSuggestions([]); setShowSuggestions(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 max-h-60 overflow-y-auto">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => selectSuggestion(s)}
                  className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors flex items-start gap-2"
                >
                  <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-400 truncate">{s.display_name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <div ref={mapRef} className="w-full h-64 rounded-2xl border border-slate-200 mb-4 z-0" />

        <button
          onClick={() => {
            if (navigator.geolocation && mapInstanceRef.current && markerRef.current) {
              navigator.geolocation.getCurrentPosition((pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                mapInstanceRef.current.setView([lat, lng], 16);
                markerRef.current.setLatLng([lat, lng]);
                setPosition({ lat, lng });
                reverseGeocode(lat, lng);
              });
            }
          }}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          <Navigation className="w-4 h-4" /> Use current location
        </button>

        <div className="card p-3 mb-3">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 mb-1">Delivery Address</p>
              <p className="text-sm text-slate-900">{address || 'Select on map...'}</p>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">{position.lat.toFixed(6)}, {position.lng.toFixed(6)}</p>
            </div>
          </div>
        </div>

        <input
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Delivery note (floor, building, phone number...)"
          className="w-full mb-4"
        />

        <div className="card p-4 mb-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Items ({cartCount})</span>
              <span className="font-semibold">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Shipping Fee</span>
              <span className="font-semibold text-blue-600">${shippingFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-100 pt-2 flex justify-between">
              <span className="text-sm font-bold">Grand Total</span>
              <span className="text-lg font-extrabold text-blue-600">${grandTotal.toFixed(2)} USDC</span>
            </div>
          </div>
        </div>

        <button onClick={handleConfirm} disabled={!address} className="btn-primary w-full">
          <Truck className="w-4 h-4" /> Confirm Address & Proceed to Payment
        </button>
      </div>
    </div>
  );
}
