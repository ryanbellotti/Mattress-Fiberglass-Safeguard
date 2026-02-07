import React, { useState } from 'react';
import { Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import { MattressBrand } from '../types';

const MattressChecker: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<MattressBrand | null>(null);
  const [searchInput, setSearchInput] = useState('');

  const sampleBrands: MattressBrand[] = [
    {
      id: '1',
      brand_name: 'Premium Sleep Co',
      model_name: 'CloudComfort 2023',
      contains_fiberglass: true,
      fiberglass_history: 'Known fiberglass barrier in premium models',
      risk_level: 'high',
      year_info: '2020-2023',
      citations: ['Consumer Report #2023-001', 'Safety Database #DB-445'],
    },
    {
      id: '2',
      brand_name: 'SafeRest',
      model_name: 'Natural Sleep',
      contains_fiberglass: false,
      fiberglass_history: 'No fiberglass materials used',
      risk_level: 'none',
      year_info: '2021-Present',
    },
  ];

  const filteredBrands = sampleBrands.filter((b) =>
    b.brand_name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Mattress Checker</h1>
        <p className="text-muted">Search our database for fiberglass contamination</p>
      </div>

      <div className="glass-card p-8 border-2 border-dashed border-white/20 rounded-xl text-center cursor-pointer hover:border-primary/50 transition-colors">
        <Upload className="mx-auto mb-4 text-primary" size={32} />
        <p className="text-lg font-semibold mb-2">Upload Mattress Image</p>
        <p className="text-sm text-muted">or search our database below</p>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search mattress brands..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full neuro-inset px-4 py-3 text-text outline-none mb-4"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => setSelectedBrand(brand)}
              className={`glass-card p-6 cursor-pointer transition-all ${
                selectedBrand?.id === brand.id
                  ? 'border-primary/50 bg-primary/10'
                  : 'hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{brand.brand_name}</h3>
                  <p className="text-sm text-muted">{brand.model_name}</p>
                </div>
                {brand.contains_fiberglass ? (
                  <AlertTriangle className="text-danger" size={20} />
                ) : (
                  <CheckCircle className="text-success" size={20} />
                )}
              </div>
              <p className="text-sm mb-3">{brand.fiberglass_history}</p>
              <div className="flex gap-2 items-center">
                <span className={`px-3 py-1 rounded text-xs font-semibold ${
                  brand.risk_level === 'high'
                    ? 'bg-danger/20 text-danger'
                    : brand.risk_level === 'none'
                    ? 'bg-success/20 text-success'
                    : 'bg-warning/20 text-warning'
                }`}>
                  {brand.risk_level.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedBrand && (
        <div className="glass-card p-6 border-l-4 border-primary">
          <h2 className="text-2xl font-semibold mb-4 gradient-text">Details for {selectedBrand.brand_name}</h2>
          <div className="space-y-3">
            <p><strong>Status:</strong> {selectedBrand.contains_fiberglass ? '⚠️ Contains Fiberglass' : '✅ Safe'}</p>
            <p><strong>Risk Level:</strong> {selectedBrand.risk_level.toUpperCase()}</p>
            <p><strong>Years:</strong> {selectedBrand.year_info}</p>
            {selectedBrand.citations && (
              <div>
                <strong>Sources:</strong>
                <ul className="list-disc list-inside text-sm text-muted mt-2">
                  {selectedBrand.citations.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MattressChecker;