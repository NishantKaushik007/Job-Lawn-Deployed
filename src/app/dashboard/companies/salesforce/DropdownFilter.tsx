'use client';

import React, { useEffect, useState } from 'react';
import Select from 'react-select';

interface DropdownProps {
  location: { company: string; value: string; code: string }[];
  jobCategory: { company: string; value: string; code: string }[];
  jobType: { company: string; value: string; code: string }[];
  country: { company: string; value: string; code: string }[];
  category: { company: string; value: string; code: string }[];
  selectedCompany: string;
  currentParams: Record<string, string[] | undefined>;
}

const DropdownFilter: React.FC<DropdownProps> = ({
  location,
  jobCategory,
  jobType,
  country,
  category,
  selectedCompany,
  currentParams,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Helper function to transform options for react-select
  const transformOptions = (data: { company: string; value: string; code: string }[]) =>
    data
      .filter((item) => !selectedCompany || item.company === selectedCompany)
      .map((item) => ({ value: item.code, label: item.value }));

  // Helper to get the selected value
  const getSelectedValue = (paramKey: string, options: { company: string; value: string; code: string }[]) => {
    const selectedCode = currentParams[paramKey]?.[0];
    return selectedCode
      ? { value: selectedCode, label: options.find((option) => option.code === selectedCode)?.value }
      : null;
  };

  if (!isClient) return null;

  const handleDropdownChange = (key: string) => (selectedOption: any) => {
    const newValue = selectedOption ? selectedOption.value : '';
    const params = new URLSearchParams(window.location.search);
    if (newValue) {
      params.set(key, newValue);
    } else {
      params.delete(key);
    }
    if (currentParams.page) {
      params.set('page', `${currentParams.page}`);
    }
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    window.location.reload();
  };

  return (
    <div className="flex flex-col mb-6 space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 w-full">
      <Select
        value={getSelectedValue('jobCategory', jobCategory)}
        onChange={handleDropdownChange('jobCategory')}
        options={transformOptions(jobCategory)}
        className="w-full sm:w-9/12"
        placeholder="Select Job Category"
        isClearable
        isSearchable
      />
      <Select
        value={getSelectedValue('country', country)}
        onChange={handleDropdownChange('country')}
        options={transformOptions(country)}
        className="w-full sm:w-9/12"
        placeholder="Select Country"
        isClearable
        isSearchable
      />
      <Select
        value={getSelectedValue('location', location)}
        onChange={handleDropdownChange('location')}
        options={transformOptions(location)}
        className="w-full sm:w-9/12"
        placeholder="Select Location"
        isClearable
        isSearchable
      />
      <Select
        value={getSelectedValue('jobType', jobType)}
        onChange={handleDropdownChange('jobType')}
        options={transformOptions(jobType)}
        className="w-full sm:w-9/12"
        placeholder="Select Job Type"
        isClearable
        isSearchable
      />
      <Select
        value={getSelectedValue('category', category)}
        onChange={handleDropdownChange('category')}
        options={transformOptions(category)}
        className="w-full sm:w-9/12"
        placeholder="Select Job Type"
        isClearable
        isSearchable
      />
    </div>
  );
};

export default DropdownFilter;
