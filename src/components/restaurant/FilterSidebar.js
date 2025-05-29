import React from 'react';

const FilterSidebar = ({ onFilterChange }) => {
  const handleFilterChange = (type, value) => {
    onFilterChange({ [type]: value });
  };

  return (
    <div className="w-64 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Filterlar</h3>
      
      {/* Price Range Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Narx oralig'i</label>
        <select
          className="w-full p-2 border rounded"
          onChange={(e) => handleFilterChange('priceRange', e.target.value)}
        >
          <option value="all">Barchasi</option>
          <option value="low">100,000 so'mdan kam</option>
          <option value="medium">100,000 - 300,000 so'm</option>
          <option value="high">300,000 so'mdan yuqori</option>
        </select>
      </div>

      {/* Cuisine Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Taom turi</label>
        <select
          className="w-full p-2 border rounded"
          onChange={(e) => handleFilterChange('cuisine', e.target.value)}
        >
          <option value="all">Barchasi</option>
          <option value="uzbek">O'zbek</option>
          <option value="european">Yevropa</option>
          <option value="asian">Osiyo</option>
          <option value="fastfood">Fast Food</option>
        </select>
      </div>

      {/* Rating Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Reyting</label>
        <select
          className="w-full p-2 border rounded"
          onChange={(e) => handleFilterChange('rating', e.target.value)}
        >
          <option value="all">Barchasi</option>
          <option value="4">4+ yulduz</option>
          <option value="3">3+ yulduz</option>
          <option value="2">2+ yulduz</option>
        </select>
      </div>
    </div>
  );
};

export default FilterSidebar; 