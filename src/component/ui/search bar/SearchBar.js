// SearchBar.js (Custom Search Bar Component)
import React from 'react';

const SearchBar = ({
  value,
  onSearch,
  placeholder = "Search...",  
  className = "",             
  style = {},                 
  onFocus,                    
  onBlur,                     
  disabled = false            
}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onSearch}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      className={`p-2 border border-gray-300 rounded ${className}`}  // Combine passed className
      style={style}  // Apply any passed inline styles
    />
  );
};

export default SearchBar;
