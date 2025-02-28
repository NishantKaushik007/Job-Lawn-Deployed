import { jobCategory, country } from '../../../../Data/data';
import DropdownFilter from './DropdownFilter';
import JobCard from '../../components/JobCard/JobCard';
import Pagination from './Pagination';
import SearchForm from '../../components/SearchForm';

interface Job {
  jobname: string;
  jobId: string;
  releaseDate: string;
  jobArea: string;
  jobRequireEn: string;
  mainBusinessEn: string;
}

interface HuaweiProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

const CACHE_EXPIRY_TIME = 60 * 1000 * 2; // 2 minutes

// In-memory cache for jobs and last fetched time
let cachedJobs: Record<string, Job[]> = {};
let lastFetched: Record<string, number> = {};

// Fetch jobs with caching
async function fetchJobs(
  jobCategoryCodes: string[],
  countryCodes: string[],
  keyword: string | undefined,
  currentPage: number
): Promise<Job[]> {
  const cacheKey = JSON.stringify({
    jobCategoryCodes,
    countryCodes,
    keyword,
    currentPage,
  });

  // Server-side cache
  if (cachedJobs[cacheKey] && Date.now() - lastFetched[cacheKey] < CACHE_EXPIRY_TIME) {
    console.log('Using cached data (server-side)');
    return cachedJobs[cacheKey];
  }

  // Client-side cache
  if (typeof window !== 'undefined') {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      console.log('Using cached data (client-side)');
      return JSON.parse(cachedData);
    }
  }

  // If not cached, fetch fresh data
  const resultsPerPage = 10;
  const queryParams = [
    `${currentPage}?`,
    `curPage=${currentPage}`,
    `pageSize=${resultsPerPage}`,
    jobCategoryCodes.length > 0 && `jobFamClsCode=${jobCategoryCodes.join('&jobFamClsCode=')}`,
    countryCodes.length > 0 && `countryCode=${countryCodes.join('&countryCode=')}`,
    keyword ? `searchText=${encodeURIComponent(keyword)}` : null,
  ]
    .filter(Boolean)
    .join('&');

  const url = `https://career.huawei.com/reccampportal/services/portal/portalpub/getJob/newHr/page/10/${queryParams}&language=en_US&orderBy=ISS_STARTDATE_DESC_AND_IS_HOT_JOB`;
  const res = await fetch(url);
  const data = await res.json();
  const jobs = data.result;

  // Cache the result
  cachedJobs[cacheKey] = jobs;
  lastFetched[cacheKey] = Date.now();

  if (typeof window !== 'undefined') {
    localStorage.setItem(cacheKey, JSON.stringify(jobs));
  }

  console.log('Fetching fresh data');
  return jobs;
}

const Page = async ({ searchParams }: HuaweiProps) => {
  // Await the promise to get the actual search parameters
  const resolvedSearchParams = await searchParams;
  const jobCategoryCodes = resolvedSearchParams.jobCategory
    ? resolvedSearchParams.jobCategory.split(',')
    : [];
  const countryCodes = resolvedSearchParams.country
    ? resolvedSearchParams.country.split(',')
    : [];
  const keyword = resolvedSearchParams.keyword || '';
  const selectedCompany = 'Huawei';

  const currentPage = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page as string, 10)
    : 1;
  const selectedJobId = resolvedSearchParams.jobId;

  // Fetch jobs from the server
  const jobs: Job[] = await fetchJobs(
    jobCategoryCodes,
    countryCodes,
    keyword,
    currentPage
  );

  const currentParams: Record<string, string[] | undefined> = {
    jobCategory: jobCategoryCodes.length > 0 ? jobCategoryCodes : undefined,
    country: countryCodes.length > 0 ? countryCodes : undefined,
  };

  // Clean search params for Pagination
  const cleanParams = Object.fromEntries(
    Object.entries(resolvedSearchParams).filter(([key, value]) => {
      return value !== undefined && value !== null && value !== 'null';
    })
  );

  const toggleJobDetails = (jobId: string) => {
    return selectedJobId === jobId ? null : jobId;
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <SearchForm initialKeyword={keyword} />
      </div>

      <div className="flex flex-col mb-6 space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 w-full">
        <DropdownFilter
          jobCategory={jobCategory}
          country={country}
          selectedCompany={selectedCompany}
          currentParams={currentParams}
        />
      </div>

      {jobs.length > 0 ? (
        <ul>
          {jobs.map((job: Job) => (
            <li key={job.jobId}>
              <JobCard
                job={{
                  title: job.jobname,
                  id_icims: job.jobId,
                  posted_date: job.releaseDate,
                  description: job.mainBusinessEn || '',
                  qualifications: job.jobRequireEn || '',
                  job_path: `https://career.huawei.com/reccampportal/portal5/campus-recruitment-detail.html?jobId=${job.jobId}&dataSource=1&jobType=3&recruitType=CR&sourceType=001`,
                  normalized_location: job.jobArea,
                }}
                onToggleDetails={() => {}}
                isSelected={resolvedSearchParams.selectedJobId === job.jobId}
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
        updatedSearchParams={cleanParams}
        loading={false}
        disableNext={jobs.length < 10}
      />
    </div>
  );
};

export default Page;
