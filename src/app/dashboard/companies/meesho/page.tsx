import React from 'react';
import DropdownFilter from './DropdownFilter';
import { jobCategory, industryExp } from '../../../../Data/data';
import Pagination from './Pagination';
import JobCard from '../../components/JobCard/JobCard';

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

const CACHE_EXPIRY_TIME = 60 * 1000 * 2; // 2 minutes

// In-memory cache for jobs and their last fetch time
let cachedJobs: Record<string, Job[]> = {};
let lastFetched: Record<string, number> = {};

// Fetch jobs with caching
async function fetchJobs(
  jobCategoryCodes: string[],
  industryExpCodes: string[],
  currentPage: number
): Promise<Job[]> {
  const cacheKey = JSON.stringify({
    jobCategoryCodes,
    industryExpCodes,
    currentPage,
  });

  if (cachedJobs[cacheKey] && Date.now() - lastFetched[cacheKey] < CACHE_EXPIRY_TIME) {
    console.log('Using cached data (server-side)');
    return cachedJobs[cacheKey];
  }

  const resultsPerPage = 10;
  const queryParams = [
    jobCategoryCodes.length > 0 && `team=${jobCategoryCodes.join('&team=')}`,
    industryExpCodes.length > 0 && `commitment=${industryExpCodes.join('&commitment=')}`,
  ]
    .filter(Boolean)
    .join('&');

  const url = `https://api.lever.co/v0/postings/meesho/?${queryParams}`;

  const res = await fetch(url);
  const data = await res.json();

  const jobs = data.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

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
  // Await the searchParams promise (wrap with Promise.resolve in case it isn’t already a Promise)
  const sp = await Promise.resolve(searchParams);

  const jobCategoryCodes = sp.jobCategory ? sp.jobCategory.split(',') : [];
  const industryExpCodes = sp.industryExp ? sp.industryExp.split(',') : [];
  const selectedCompany = 'Meesho';

  const currentPage = sp.page ? parseInt(sp.page, 10) : 1;
  // Optionally, you can use sp.jobId for selection later
  const selectedJobId = sp.jobId;

  const jobs: Job[] = await fetchJobs(jobCategoryCodes, industryExpCodes, currentPage);

  // Convert search parameters to a serializable object (all values as strings)
  const serializableParams: Record<string, string> = Object.fromEntries(
    Object.entries(sp)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [key, value as string])
  );

  return (
    <div className="p-4">
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

      {jobs.length > 0 ? (
        <ul>
          {jobs.map((job: Job) => (
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

      <Pagination
        currentPage={currentPage}
        updatedSearchParams={serializableParams}
        loading={false}
        disableNext={jobs.length < 10}
      />
    </div>
  );
};

export default Page;
