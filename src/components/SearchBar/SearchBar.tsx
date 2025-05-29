import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === '') {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSearch} style={{
      position: 'absolute',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 4,
      display: 'flex',
      gap: '8px',
      backgroundColor: '#1e293b',
      padding: '8px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search for a job..."
        style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: '1px solid #334155',
          backgroundColor: '#0f172a',
          color: '#e2e8f0',
          fontSize: '14px',
          minWidth: '300px',
          outline: 'none'
        }}
      />
      <button
        type="submit"
        style={{
          padding: '8px 20px',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: '#3b82f6',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;