import React from 'react';
import DropdownFilter from './DropdownFilter';
import { jobCategory, industryExp } from '../../../../Data/data';
import Pagination from './Pagination';
import JobCard from '../../components/JobCard/JobCard';
import SearchForm from '../../components/SearchForm';

interface Job {
  text: string;
  id: string;
  createdAt: string;
  categories: {
    allLocations: string[];
  };
  descriptionPlain: string;
  additionalPlain: string;
  hostedUrl: string;
}

const CACHE_EXPIRY_TIME = 2 * 60 * 1000; // 2 minutes

// In-memory cache for jobs and their last fetch time
let cachedJobs: Record<string, Job[]> = {};
let lastFetched: Record<string, number> = {};

// Fetch jobs with caching (returns the full list)
async function fetchJobs(
  jobCategoryCodes: string[],
  industryExpCodes: string[],
  // currentPage is not used for slicing here
  currentPage: number
): Promise<Job[]> {
  const cacheKey = JSON.stringify({
    jobCategoryCodes,
    industryExpCodes,
  });

  if (cachedJobs[cacheKey] && Date.now() - lastFetched[cacheKey] < CACHE_EXPIRY_TIME) {
    console.log('Using cached data (server-side)');
    return cachedJobs[cacheKey];
  }

  const resultsPerPage = 10; // used later for pagination
  const queryParams = [
    jobCategoryCodes.length > 0 && `team=${jobCategoryCodes.join('&team=')}`,
    industryExpCodes.length > 0 && `commitment=${industryExpCodes.join('&commitment=')}`,
  ]
    .filter(Boolean)
    .join('&');

  const url = `https://api.lever.co/v0/postings/meesho/?${queryParams}`;

  const res = await fetch(url);
  const data = await res.json();

  // Instead of slicing here, return the complete list of jobs.
  const jobs: Job[] = data; 

  cachedJobs[cacheKey] = jobs;
  lastFetched[cacheKey] = Date.now();

  return jobs;
}

// The page component now declares searchParams as a Promise to satisfy Next.js’s requirement.
const Page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) => {
  // Await the searchParams promise
  const sp = await searchParams;

  // Extract filters from query parameters
  const jobCategoryCodes = sp.jobCategory ? sp.jobCategory.split(',') : [];
  const industryExpCodes = sp.industryExp ? sp.industryExp.split(',') : [];
  const keyword = sp.keyword || "";
  const selectedCompany = 'Meesho';

  // Use sp.page for pagination (default page 1)
  const currentPage = sp.page ? parseInt(sp.page, 10) : 1;

  // Fetch the full list of jobs based on dropdown filters (without slicing)
  const allJobs: Job[] = await fetchJobs(jobCategoryCodes, industryExpCodes, currentPage);

  // Apply search filter on job title (the 'text' property)
  const filteredByKeyword = keyword
    ? allJobs.filter((job) =>
        job.text.toLowerCase().includes(keyword.toLowerCase())
      )
    : allJobs;

  // Now apply pagination on the filtered results
  const resultsPerPage = 10;
  const indexOfLastJob = currentPage * resultsPerPage;
  const indexOfFirstJob = indexOfLastJob - resultsPerPage;
  const paginatedJobs = filteredByKeyword.slice(indexOfFirstJob, indexOfLastJob);

  // Convert search parameters to a serializable object (all values as strings)
  const serializableParams: Record<string, string> = Object.fromEntries(
    Object.entries(sp)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [key, value as string])
  );

  return (
    <div className="p-4">
      {/* Search Form for Title Filtering */}
      <div className="mb-6">
        <SearchForm initialKeyword={keyword} />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-col mb-6 space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 w-full">
        <DropdownFilter
          jobCategory={jobCategory}
          industryExp={industryExp}
          selectedCompany={selectedCompany}
          currentParams={{
            jobCategory: jobCategoryCodes,
            industryExp: industryExpCodes,
          }}
        />
      </div>

      {/* Job Listings */}
      {paginatedJobs.length > 0 ? (
        <ul>
          {paginatedJobs.map((job: Job) => (
            <li key={job.id}>
              <JobCard
                job={{
                  title: job.text,
                  id_icims: job.id,
                  posted_date: job.createdAt,
                  description: job.additionalPlain || '',
                  qualifications: job.descriptionPlain || '',
                  job_path: job.hostedUrl,
                  normalized_location: job.categories.allLocations.join(', '),
                }}
                onToggleDetails={() => {}}
                isSelected={sp.jobId === job.id}
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
        updatedSearchParams={serializableParams}
        loading={false}
        disableNext={paginatedJobs.length < resultsPerPage}
      />
    </div>
  );
};

export default Page;
