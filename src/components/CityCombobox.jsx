import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronDown, Plus, Check, X, Search } from 'lucide-react';
import { CITIES } from '../data/mockData';

/**
 * Searchable & Expandable City Combobox Component
 * - Allows searching through existing cities as characters are typed.
 * - Allows typing a brand-new city name and adding it dynamically to the master list.
 * - Works smoothly with Urdu and English input.
 */
export default function CityCombobox({
  value = '', // Can be city id or city name
  cityName = '', // Explicit Urdu city name if available
  onChange, // ({ id, name }) => void
  citiesList = CITIES, // Array of { id, name }
  onAddNewCity, // (newCityName) => { id, name }
  placeholder = 'شہر کا نام تلاش کریں یا نیا لکھیں...',
  className = '',
  inputClassName = '',
  required = false,
  theme = 'navy'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const isNavy = theme === 'navy';
  const safeCitiesList = (citiesList && Array.isArray(citiesList) && citiesList.length > 0) ? citiesList : CITIES;

  // Determine current display name based on value or cityName
  useEffect(() => {
    if (cityName) {
      setQuery(cityName);
    } else if (value) {
      const match = safeCitiesList.find(c => c && (c.id === value || c.name === value));
      if (match) {
        setQuery(match.name);
      } else {
        setQuery(value);
      }
    } else {
      setQuery('');
    }
  }, [value, cityName, safeCitiesList]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // If user typed something that isn't selected, auto-commit as custom city if not empty
        if (isOpen && query.trim()) {
          commitCurrentQuery(query.trim());
        }
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, query]);

  // Normalize Urdu strings for loose matching
  const normalizeText = (text) => {
    if (!text) return '';
    return text
      .trim()
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ہ')
      .replace(/ي/g, 'ی')
      .replace(/[\s\-_]+/g, ' ');
  };

  // Filter existing cities based on query
  const cleanQuery = normalizeText(query);
  const filteredCities = safeCitiesList
    .filter(c => c && c.id !== 'all')
    .filter(c => {
      if (!cleanQuery) return true;
      const cleanName = normalizeText(c.name);
      const cleanId = normalizeText(c.id);
      return cleanName.includes(cleanQuery) || cleanId.includes(cleanQuery);
    });

  // Check if query exactly matches any existing city
  const exactMatch = safeCitiesList.find(c => {
    if (!c || c.id === 'all') return false;
    return normalizeText(c.name) === cleanQuery || normalizeText(c.id) === cleanQuery;
  });

  // Commit typed query or new city
  const commitCurrentQuery = (typedName) => {
    const trimmed = typedName.trim();
    if (!trimmed) return;

    // Check if it already matches an existing city
    const existing = safeCitiesList.find(c => {
      if (!c || c.id === 'all') return false;
      return normalizeText(c.name) === normalizeText(trimmed);
    });

    if (existing) {
      if (onChange) onChange({ id: existing.id, name: existing.name });
      setQuery(existing.name);
    } else {
      // Add as new city
      let newCityObj = null;
      if (onAddNewCity) {
        newCityObj = onAddNewCity(trimmed);
      } else {
        const slug = trimmed.toLowerCase().replace(/[\s\-_]+/g, '-').replace(/[^\w\u0600-\u06FF\-]+/g, '');
        newCityObj = { id: slug || trimmed, name: trimmed };
      }
      if (onChange && newCityObj) {
        onChange(newCityObj);
      }
      setQuery(trimmed);
    }
  };

  const handleSelectCity = (city) => {
    setQuery(city.name);
    if (onChange) onChange(city);
    setIsOpen(false);
  };

  const handleAddNew = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    commitCurrentQuery(trimmed);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCities.length > 0 && !exactMatch && filteredCities[0]) {
        // If there is a filtered match, select it
        handleSelectCity(filteredCities[0]);
      } else if (query.trim()) {
        handleAddNew();
      }
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setQuery('');
    if (onChange) onChange({ id: '', name: '' });
    if (inputRef.current) inputRef.current.focus();
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input wrapper */}
      <div className="relative flex items-center">
        <MapPin className={`w-4 h-4 text-slate-400 absolute right-3 pointer-events-none ${isFocused ? (isNavy ? 'text-blue-600' : 'text-emerald-600') : ''}`} />
        
        <input
          ref={inputRef}
          type="text"
          required={required}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (onChange) {
              // Pass current text so form state stays in sync
              const slug = e.target.value.trim().toLowerCase().replace(/[\s\-_]+/g, '-');
              onChange({ id: slug, name: e.target.value });
            }
          }}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-16 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white transition-all font-bold ${
            isNavy ? 'focus:ring-2 focus:ring-blue-500' : 'focus:ring-2 focus:ring-emerald-500'
          } ${inputClassName}`}
        />

        {/* Right side controls (Clear & Dropdown Toggle) */}
        <div className="absolute left-2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
              title="صاف کریں"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setIsOpen(!isOpen);
              if (!isOpen && inputRef.current) inputRef.current.focus();
            }}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dropdown Suggestions Menu */}
      {isOpen && (
        <div className="absolute z-50 right-0 left-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-64 overflow-y-auto">
          
          {/* Header indicator / Search hint */}
          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-sans">
            <span>شہر منتخب کریں یا نیا لکھیں</span>
            <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">
              {filteredCities.length} شہر دستیاب
            </span>
          </div>

          {/* New City Quick Add Option (if typed text isn't an exact match) */}
          {query.trim() && !exactMatch && (
            <div className="p-1 border-b border-slate-100 bg-amber-50/60">
              <button
                type="button"
                onClick={handleAddNew}
                className="w-full text-right px-3 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-100/70 hover:bg-amber-200/80 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span>بطور نیا شہر شامل کریں:</span>
                    <span className="mr-1 text-amber-700 underline underline-offset-2">"{query.trim()}"</span>
                  </div>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-800 px-2 py-0.5 rounded-full font-sans">
                  + نیا شہر
                </span>
              </button>
            </div>
          )}

          {/* List of Matched Cities */}
          <div className="p-1 space-y-0.5">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => {
                const isSelected = 
                  (value && (city.id === value || city.name === value)) ||
                  (cityName && city.name === cityName) ||
                  (query && normalizeText(city.name) === cleanQuery);

                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => handleSelectCity(city)}
                    className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      isSelected
                        ? isNavy
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? (isNavy ? 'text-blue-600' : 'text-emerald-600') : 'text-slate-400'}`} />
                      <span>{city.name}</span>
                    </div>

                    {isSelected && (
                      <Check className={`w-4 h-4 ${isNavy ? 'text-blue-600' : 'text-emerald-600'}`} />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-500 space-y-2">
                <p>کوئی مماثل شہر نہیں ملا۔</p>
                {query.trim() && (
                  <button
                    type="button"
                    onClick={handleAddNew}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>"{query.trim()}" کو بطور نیا شہر شامل کریں</span>
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
