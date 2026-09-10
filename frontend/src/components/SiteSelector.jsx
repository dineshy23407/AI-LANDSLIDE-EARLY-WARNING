import React, { useState } from 'react';
import { MapPin, Mountain, PlusCircle, Search, Filter, X, Check, Globe } from 'lucide-react';
import { DEFAULT_SITES, NE_STATES } from '../utils/constants';

export default function SiteSelector({
  sites,
  selectedSiteId,
  onSelectSite,
  onAddCustomSite,
  activeScenario
}) {
  const currentSites = (sites && sites.length > 0) ? sites : DEFAULT_SITES;
  const currentSite = currentSites.find(s => s.site_id === selectedSiteId) || currentSites[0];

  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for manual location entry
  const [formData, setFormData] = useState({
    name: '',
    state: 'Sikkim',
    site_id: '',
    elevation_m: 1450,
    terrain_type: 'Metamorphic Gneiss & Mica Schist, High Seepage',
    description: ''
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter sites based on state and search query
  const filteredSites = currentSites.filter(site => {
    const matchesState = selectedStateFilter === 'ALL' || site.state === selectedStateFilter;
    const matchesSearch = !searchQuery ||
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.site_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (site.terrain && site.terrain.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesState && matchesSearch;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitCustomSite = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Location name is required.');
      return;
    }
    if (!formData.state) {
      setFormError('Please select a North Eastern state.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    try {
      // Auto-generate site_id if not provided
      let finalId = formData.site_id.trim();
      if (!finalId) {
        const prefix = formData.state.substring(0, 2).toUpperCase();
        const randNum = Math.floor(10 + Math.random() * 90);
        finalId = `${prefix}-${randNum}`;
      } else {
        finalId = finalId.toUpperCase();
      }

      const newSitePayload = {
        site_id: finalId,
        name: formData.name.trim(),
        state: formData.state,
        elevation_m: parseInt(formData.elevation_m, 10) || 1200,
        terrain_type: formData.terrain_type.trim() || 'Steep Himalayan Colluvium',
        description: formData.description.trim() || `User-configured slope monitoring node in ${formData.name}, ${formData.state}.`
      };

      await onAddCustomSite(newSitePayload);

      // Reset form and close modal
      setFormData({
        name: '',
        state: 'Sikkim',
        site_id: '',
        elevation_m: 1450,
        terrain_type: 'Metamorphic Gneiss & Mica Schist, High Seepage',
        description: ''
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating custom site:', err);
      setFormError(err.message || 'Failed to register custom location.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Top Header Row with Location Selector and Enter Manually Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={18} color="#06B6D4" />
          <div>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F3F4F6' }}>
              North Eastern Region — Monitoring Location Network
            </span>
            <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              Select an existing corridor or manually enter any custom landslide slope in the 8 NE states
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Enter Manually Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              background: 'linear-gradient(135deg, #059669, #10B981)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
            }}
          >
            <PlusCircle size={15} />
            <span>Enter Location Manually</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.25)',
        padding: '0.5rem 0.75rem',
        borderRadius: '8px',
        border: '1px solid #1F293D'
      }}>
        {/* State Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Filter size={14} color="#9CA3AF" />
          <select
            value={selectedStateFilter}
            onChange={(e) => setSelectedStateFilter(e.target.value)}
            style={{
              background: '#1F2937',
              color: '#F3F4F6',
              border: '1px solid #374151',
              borderRadius: '6px',
              padding: '0.3rem 0.6rem',
              fontSize: '0.78rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All NE States ({currentSites.length})</option>
            {NE_STATES.map(st => {
              const count = currentSites.filter(s => s.state === st).length;
              return (
                <option key={st} value={st}>
                  {st} {count > 0 ? `(${count})` : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* Quick Dropdown Picker for Direct Selection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flex: '1 1 220px' }}>
          <Globe size={14} color="#06B6D4" />
          <select
            value={selectedSiteId}
            onChange={(e) => onSelectSite(e.target.value)}
            style={{
              width: '100%',
              background: '#1F2937',
              color: '#93C5FD',
              border: '1px solid #3B82F6',
              borderRadius: '6px',
              padding: '0.35rem 0.6rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {currentSites.map(s => (
              <option key={s.site_id} value={s.site_id}>
                [{s.site_id}] {s.name} ({s.state})
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flex: '1 1 180px', position: 'relative' }}>
          <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: '8px' }} />
          <input
            type="text"
            placeholder="Search hill, highway or station..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: '#111827',
              border: '1px solid #374151',
              borderRadius: '6px',
              padding: '0.3rem 0.5rem 0.3rem 1.8rem',
              color: '#F3F4F6',
              fontSize: '0.78rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Horizontal Cards Grid for Selected Filter */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '0.65rem',
        maxHeight: '210px',
        overflowY: 'auto',
        paddingRight: '0.25rem'
      }}>
        {filteredSites.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '1.25rem', textAlign: 'center', color: '#6B7280', fontSize: '0.82rem' }}>
            No monitoring locations found matching your criteria. Use <strong>"Enter Location Manually"</strong> to add one.
          </div>
        ) : (
          filteredSites.map((site) => {
            const isSelected = site.site_id === selectedSiteId;
            return (
              <div
                key={site.site_id}
                onClick={() => onSelectSite(site.site_id)}
                style={{
                  background: isSelected ? 'rgba(59, 130, 246, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1.5px solid ${isSelected ? '#3B82F6' : '#1F293D'}`,
                  borderRadius: '8px',
                  padding: '0.7rem 0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                    <span style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      background: isSelected ? '#2563EB' : '#374151',
                      color: '#FFF',
                      padding: '0.1rem 0.35rem',
                      borderRadius: '3px',
                      flexShrink: 0
                    }}>
                      {site.site_id}
                    </span>
                    <strong style={{
                      fontSize: '0.82rem',
                      color: isSelected ? '#93C5FD' : '#F3F4F6',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {site.name}
                    </strong>
                  </div>
                  {isSelected && (
                    <span style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: '#3B82F6',
                      boxShadow: '0 0 6px #3B82F6',
                      flexShrink: 0
                    }} />
                  )}
                </div>

                <div style={{ fontSize: '0.72rem', color: '#9CA3AF', display: 'flex', justifyContent: 'space-between' }}>
                  <span>State: <strong style={{ color: '#D1D5DB' }}>{site.state}</strong></span>
                  <span>Elev: {site.elevation || `${site.elevation_m || 1000}m`}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Selected Site Details Strip */}
      {currentSite && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.25)',
          borderLeft: '3px solid #06B6D4',
          borderRadius: '4px',
          padding: '0.6rem 0.85rem',
          fontSize: '0.78rem',
          color: '#9CA3AF',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <Mountain size={16} color="#06B6D4" style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ color: '#E5E7EB' }}>{currentSite.name} ({currentSite.site_id}, {currentSite.state}): </strong>
            {currentSite.description || currentSite.terrain_type || currentSite.terrain || 'Strategic slope monitoring node equipped with virtual rainfall, moisture, tilt, and vibration telemetry sensors.'}
          </div>
        </div>
      )}

      {/* Manual Location Entry Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #1F293D', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} color="#10B981" />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F9FAFB' }}>
                    Enter New Monitoring Location Manually
                  </h3>
                  <p style={{ fontSize: '0.76rem', color: '#9CA3AF' }}>
                    Configure an authentic slope or highway corridor anywhere in the North Eastern Region
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-outline"
                style={{ padding: '0.3rem 0.5rem' }}
              >
                <X size={16} />
              </button>
            </div>

            {formError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #EF4444',
                color: '#FCA5A5',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                marginBottom: '1rem'
              }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitCustomSite} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Location Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#D1D5DB', marginBottom: '0.3rem' }}>
                  Location / Slope Corridor Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g., Pelling-Dentam Ridge, Haflong Cutting, Tupul Slope"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    background: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    padding: '0.45rem 0.75rem',
                    color: '#F3F4F6',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* State and Station Code Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#D1D5DB', marginBottom: '0.3rem' }}>
                    North Eastern State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      background: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      padding: '0.45rem 0.75rem',
                      color: '#F3F4F6',
                      fontSize: '0.82rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {NE_STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#D1D5DB', marginBottom: '0.3rem' }}>
                    Station Code (Optional)
                  </label>
                  <input
                    type="text"
                    name="site_id"
                    placeholder="e.g., SK-05 or auto"
                    value={formData.site_id}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      background: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      padding: '0.45rem 0.75rem',
                      color: '#F3F4F6',
                      fontSize: '0.82rem',
                      fontFamily: 'monospace',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Elevation and Terrain Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#D1D5DB', marginBottom: '0.3rem' }}>
                    Elevation (meters)
                  </label>
                  <input
                    type="number"
                    name="elevation_m"
                    value={formData.elevation_m}
                    onChange={handleInputChange}
                    min="100"
                    max="6000"
                    style={{
                      width: '100%',
                      background: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      padding: '0.45rem 0.75rem',
                      color: '#F3F4F6',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#D1D5DB', marginBottom: '0.3rem' }}>
                    Geological Terrain Type
                  </label>
                  <input
                    type="text"
                    name="terrain_type"
                    value={formData.terrain_type}
                    onChange={handleInputChange}
                    placeholder="e.g., Weathered Phyllite, Silty Shale"
                    style={{
                      width: '100%',
                      background: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      padding: '0.45rem 0.75rem',
                      color: '#F3F4F6',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#D1D5DB', marginBottom: '0.3rem' }}>
                  Corridor Description / Hazard Context
                </label>
                <textarea
                  name="description"
                  rows="2"
                  placeholder="e.g., Steep road cutting exposed to monsoon slope creep and drainage overflow."
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    background: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    padding: '0.45rem 0.75rem',
                    color: '#F3F4F6',
                    fontSize: '0.82rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    fontSize: '0.8rem',
                    background: 'linear-gradient(135deg, #059669, #10B981)'
                  }}
                >
                  <Check size={14} />
                  <span>{isSubmitting ? 'Registering...' : 'Register & Start Monitoring'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
