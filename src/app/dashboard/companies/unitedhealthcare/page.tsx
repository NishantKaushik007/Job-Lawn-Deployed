// page.tsx
import React from 'react';
import DropdownFilter from './DropdownFilter';
import Pagination from './Pagination';
import JobCard from '../../components/JobCard/JobCard';
import SearchForm from '../../components/SearchForm';

export interface JobListing {
  portalJobPost: {
    portalId: string;
    portalUrl: string;
    id: string;
    updatedDate: string;
  };
  id: string;
  ref: string;
  portalId: number;
  title: string;
  type: string; // job_type
  employmentType: string; // employment_type
  brand: string;
  level: string;
  locations: string[]; // e.g. [ "Las Vegas, NV, US" ]
  category: string; // primary_category
  primaryCountry: string; // primary_country (usually a code like IN, US, etc.)
  overview: string;
  responsibilities: string;
  qualifications: string;
  applyUrl: string;
}

// Update PageProps so that searchParams is a Promise.
interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

const CACHE_EXPIRY_TIME = 2 * 60 * 1000; // 2 minutes

// Global in-memory cache (server side)
const jobCache: Record<string, { data: JobListing[]; timestamp: number }> = {};

// Helper: Fetch a single page from the API
const fetchPage = async (offset: number): Promise<any> => {
  const url = `https://jobsapi-internal.m-cloud.io/api/job?organization=2071&offset=${offset}&limit=500&format=json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error fetching page at offset ${offset}: ${res.statusText}`);
  }
  return res.json();
};

// Helper: Map an API job object to our JobListing interface with new fields
const mapJob = (job: any): JobListing => {
  return {
    portalJobPost: {
      portalId: "2071",
      portalUrl: job.url || "",
      id: String(job.id),
      updatedDate: job.open_date || "",
    },
    id: String(job.id),
    ref: String(job.ref),
    portalId: 2071,
    title: job.title || "",
    type: job.job_type || "",
    employmentType: job.employment_type || "",
    brand: job.brand || "",
    level: job.level || "",
    // Combine available location parts (city, state, country)
    locations: [
      [job.primary_city, job.primary_state, job.primary_country]
        .filter(Boolean)
        .join(', '),
    ],
    category: job.primary_category || "",
    primaryCountry: job.primary_country || "",
    overview: job.description || "",
    responsibilities: "", // adjust if API returns additional details
    qualifications: "",
    applyUrl: job.url || "",
  };
};

// Fetch all jobs using offset pagination logic with deduplication
const fetchAllJobs = async (): Promise<JobListing[]> => {
  // Fetch first page (offset=1) to get totalHits and first 500 jobs
  const firstPage = await fetchPage(1);
  const totalHits = firstPage.totalHits;
  console.log('Total Hits reported by API:', totalHits);
  const pages = Math.ceil(totalHits / 500);

  // Use a map to deduplicate jobs by id
  const jobsMap: Record<string, JobListing> = {};

  // Process the first page (offset=1)
  (firstPage.queryResult || []).forEach((job: any) => {
    const mappedJob = mapJob(job);
    jobsMap[mappedJob.id] = mappedJob;
  });

  // Loop for remaining pages; offsets: 51, 101, 151, ... 
  for (let i = 1; i < pages; i++) {
    const offset = 1 + i * 50; // e.g. i=1 gives offset=51
    console.log(`Fetching jobs with offset ${offset}...`);
    try {
      const pageData = await fetchPage(offset);
      (pageData.queryResult || []).forEach((job: any) => {
        const mappedJob = mapJob(job);
        jobsMap[mappedJob.id] = mappedJob;
      });
    } catch (error) {
      console.error(error);
      break;
    }
  }

  const allJobs = Object.values(jobsMap);
  console.log('Finished fetching jobs. Total unique jobs collected:', allJobs.length);
  return allJobs;
};

// Fetch jobs with caching logic (filtering is done later)
const fetchJobs = async (_filters: Record<string, string | undefined>): Promise<JobListing[]> => {
  const cacheKey = 'allJobs';
  if (jobCache[cacheKey] && Date.now() - jobCache[cacheKey].timestamp < CACHE_EXPIRY_TIME) {
    console.log('Using server-side cached data');
    return jobCache[cacheKey].data;
  }
  try {
    console.log('Fetching fresh data from API');
    const allJobs = await fetchAllJobs();
    jobCache[cacheKey] = { data: allJobs, timestamp: Date.now() };
    return allJobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

export default async function Page({ searchParams }: PageProps) {
  // Await the searchParams before using them
  const resolvedSearchParams = await searchParams;
  
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const resultsPerPage = 10;

  // Build filters from resolved search parameters (including keyword for title search)
  const filters: Record<string, string | undefined> = {
    primary_country: resolvedSearchParams.primary_country,
    primary_category: resolvedSearchParams.primary_category,
    job_type: resolvedSearchParams.job_type,
    employment_type: resolvedSearchParams.employment_type,
    brand: resolvedSearchParams.brand,
    level: resolvedSearchParams.level,
    keyword: resolvedSearchParams.keyword,
  };

  // Fetch all jobs (filtering is applied after fetching)
  const jobs = await fetchJobs(filters);

  // Country mapping: Replace codes with full names
  const countryMap: Record<string, string> = {
    IN: "India",
    US: "United States",
    IE: "Ireland",
    GB: "United Kingdom",
    PH: "Philippines"
    // Add additional mappings as needed
  };

  // Dynamically derive filter options from the API response for each field:
  const availableCountries = Array.from(new Set(jobs.map(job => job.primaryCountry)))
    .filter(Boolean)
    .map(val => ({
      company: "JobAPI",
      value: val,
      code: val,
      label: countryMap[val] || val,
    }));
  const availableCategories = Array.from(new Set(jobs.map(job => job.category)))
    .filter(Boolean)
    .map(val => ({ company: "JobAPI", value: val, code: val }));
  const availableJobTypes = Array.from(new Set(jobs.map(job => job.type)))
    .filter(Boolean)
    .map(val => ({ company: "JobAPI", value: val, code: val }));
  const availableEmploymentTypes = Array.from(new Set(jobs.map(job => job.employmentType)))
    .filter(Boolean)
    .map(val => ({ company: "JobAPI", value: val, code: val }));
  const availableBrands = Array.from(new Set(jobs.map(job => job.brand)))
    .filter(Boolean)
    .map(val => ({ company: "JobAPI", value: val, code: val }));
  const availableLevels = Array.from(new Set(jobs.map(job => job.level)))
    .filter(Boolean)
    .map(val => ({ company: "JobAPI", value: val, code: val }));

  // Apply filtering including title search (keyword) - case insensitive match
  const filteredJobs = jobs.filter((job) => {
    const matchCountry = filters.primary_country ? job.primaryCountry === filters.primary_country : true;
    const matchCategory = filters.primary_category ? job.category === filters.primary_category : true;
    const matchJobType = filters.job_type ? job.type === filters.job_type : true;
    const matchEmploymentType = filters.employment_type ? job.employmentType === filters.employment_type : true;
    const matchBrand = filters.brand ? job.brand === filters.brand : true;
    const matchLevel = filters.level ? job.level === filters.level : true;
    const matchKeyword = filters.keyword
      ? job.title.toLowerCase().includes(filters.keyword.toLowerCase())
      : true;
    return matchCountry && matchCategory && matchJobType && matchEmploymentType && matchBrand && matchLevel && matchKeyword;
  });

  // Paginate the filtered jobs
  const indexOfLastJob = currentPage * resultsPerPage;
  const indexOfFirstJob = indexOfLastJob - resultsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <div className="p-4">
      {/* Search Form for Title Filtering */}
      <div className="mb-6">
        <SearchForm initialKeyword={resolvedSearchParams.keyword || ""} />
      </div>

      {/* Six Dropdown Filters using dynamic options */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
        <DropdownFilter
          label="Country"
          options={availableCountries}
          searchParamsKey="primary_country"
          currentValue={resolvedSearchParams.primary_country}
        />
        <DropdownFilter
          label="Category"
          options={availableCategories}
          searchParamsKey="primary_category"
          currentValue={resolvedSearchParams.primary_category}
        />
        <DropdownFilter
          label="Job Type"
          options={availableJobTypes}
          searchParamsKey="job_type"
          currentValue={resolvedSearchParams.job_type}
        />
        <DropdownFilter
          label="Employment Type"
          options={availableEmploymentTypes}
          searchParamsKey="employment_type"
          currentValue={resolvedSearchParams.employment_type}
        />
        <DropdownFilter
          label="Brand"
          options={availableBrands}
          searchParamsKey="brand"
          currentValue={resolvedSearchParams.brand}
        />
        <DropdownFilter
          label="Level"
          options={availableLevels}
          searchParamsKey="level"
          currentValue={resolvedSearchParams.level}
        />
      </div>

      {/* Job Listings */}
      {currentJobs.length > 0 ? (
        <ul>
          {currentJobs.map((job) => (
            <li key={job.id}>
              <JobCard
                job={{
                  title: job.title,
                  id_icims: job.ref,
                  job_path: job.portalJobPost.portalUrl,
                  postingDate: job.portalJobPost.updatedDate,
                  normalized_location: job.locations.join(' | '),
                  basic_qualifications: job.qualifications,
                  description: job.overview,
                  preferred_qualifications: '',
                  responsibilities: job.responsibilities,
                }}
                onToggleDetails={() => {}}
                isSelected={false}
                baseUrl=""
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-white mt-4">
          No job found for selected criteria.
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalResults={filteredJobs.length}
        resultsPerPage={resultsPerPage}
        loading={false}
        disableNext={filteredJobs.length < resultsPerPage}
      />
    </div>
  );
}
