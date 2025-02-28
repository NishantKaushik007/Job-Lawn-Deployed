import JobCard from '../../components/JobCard/JobCard';
import Pagination from './Pagination';
import DropdownFilter from './DropdownFilter';
import { jobCategory, jobType, country, industryExp } from '../../../../Data/data';
import SearchForm from '../../components/SearchForm';

// Define the Job interface
interface Job {
  name: string;
  display_job_id: string;
  canonicalPositionUrl: string;
  locations: string[];
  id: string;
  custom_JD: {
    data_fields: {
      posteddate: string[];
    };
  };
  description: string;
}

const CACHE_EXPIRY_TIME = 60 * 1000 * 2; // 2 minutes
const RESULTS_PER_PAGE = 10; // Define how many results per page

let serverCache: Record<string, { jobs: Job[]; totalJobsCount: number }> = {};
let isClient = typeof window !== 'undefined'; // Check if running on the client side

const getLocalStorageWithExpiry = (key: string): { jobs: Job[]; totalJobsCount: number } | null => {
  if (typeof window !== 'undefined') {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_EXPIRY_TIME) {
        return { jobs: data, totalJobsCount: data.length };
      }
    }
  }
  return null;
};

const saveToLocalStorage = (key: string, data: Job[]): void => {
  if (typeof window !== 'undefined') {
    const cacheObject = { data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(cacheObject));
  }
};

const transformFilters = (filters: Record<string, string[] | undefined>): Record<string, string | undefined> => {
  const transformedFilters: Record<string, string | undefined> = {};
  for (const key in filters) {
    if (filters[key]) {
      transformedFilters[key] = filters[key]?.[0];
    }
  }
  return transformedFilters;
};

const fetchJobs = async (
  filters: Record<string, string[] | undefined>,
  page: number,
  keyword: string
): Promise<{ jobs: Job[]; totalJobsCount: number }> => {
  const cacheKey = `jobs-cache-${JSON.stringify(filters)}-${page}-${keyword}`;

  // Check server-side cache
  if (serverCache[cacheKey]) {
    console.log('Returning data from server-side cache');
    return serverCache[cacheKey];
  }

  // Check client-side cache with expiry
  if (isClient) {
    const cachedData = getLocalStorageWithExpiry(cacheKey);
    if (cachedData) {
      console.log('Returning data from client-side cache (localStorage)');
      return cachedData;
    }
  }

  try {
    // Construct the query parameters
    const queryParams = [
      filters.jobType && `EmploymentType=${filters.jobType[0]}`,
      filters.country && `Location=${filters.country[0]}`,
      filters.jobCategory && `BusinessArea=${filters.jobCategory[0]}`,
      filters.industryExp && `PCSJobLevel=${filters.industryExp[0]}`,
      filters.keyword && `query=${filters.keyword[0].replace(/\s+/g, '+')}`,
      `start=${(page - 1) * RESULTS_PER_PAGE}`,
      `num=${RESULTS_PER_PAGE}`,
    ]
      .filter(Boolean)
      .join('&');

    const url = `https://morganstanley.eightfold.ai/api/apply/v2/jobs?domain=morganstanley.com&${queryParams}&sort_by=relevance&triggerGoButton=false`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }

    const data = await response.json();
    const jobs = data.positions;
    const totalJobsCount = data?.items?.[0]?.TotalJobsCount || 0;

    // Cache data
    if (isClient) {
      saveToLocalStorage(cacheKey, jobs);
    }
    serverCache[cacheKey] = { jobs, totalJobsCount };

    return { jobs, totalJobsCount };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Failed to fetch jobs');
  }
};

const fetchJobDetails = async (jobId: string, postingDateAccumulator: { [key: string]: string }): Promise<Partial<Job>> => {
  try {
    if (!jobId) {
      throw new Error('Invalid jobId provided');
    }

    const url = `https://morganstanley.eightfold.ai/api/apply/v2/jobs/${jobId}?domain=morganstanley.com`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch job details: ${response.statusText}`);
    }

    const data = await response.json();

    const postingDate = Array.isArray(data.custom_JD.data_fields?.posteddate) && data.custom_JD.data_fields?.posteddate.length
      ? data.custom_JD.data_fields.posteddate[0]
      : '';

    postingDateAccumulator[jobId] = postingDate;

    return {
      description: data?.job_description || '',
    };
  } catch (error) {
    console.error('Error fetching job details:', error);
    return {};
  }
};

// Updated Microsoft page component
// Note: We change the prop type for searchParams to be a Promise.
const MorganStanley = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) => {
  // Await the searchParams promise (wrap with Promise.resolve in case it's not already a Promise)
  const sp = await Promise.resolve(searchParams);

  const { country: selectedCountry, jobCategory: selectedJobCategory, industryExp: selectedIndustryExp, jobType: selectedJobType, page, keyword } = sp;
  const selectedCompany = 'Morgan Stanley';

  const jobCategoryDropdown = (jobCategory ?? []).filter((item) => item.company === selectedCompany);
  const locationDropdown = (country ?? []).filter((item) => item.company === selectedCompany);
  const industryExpDropdown = (industryExp ?? []).filter((item) => item.company === selectedCompany);
  const jobTypeDropdown = (jobType ?? []).filter((item) => item.company === selectedCompany);

  const filters: Record<string, string[] | undefined> = {
    country: selectedCountry ? [selectedCountry] : undefined,
    jobCategory: selectedJobCategory ? [selectedJobCategory] : undefined,
    industryExp: selectedIndustryExp ? [selectedIndustryExp] : undefined,
    jobType: selectedJobType ? [selectedJobType] : undefined,
    keyword: keyword ? [keyword] : undefined,
  };

  const transformedFilters = transformFilters(filters);
  const currentPage = parseInt(page || '1', 10);
  const searchKeyword = keyword || '';

  // Initialize posting date accumulator
  const newPostingDates: { [key: string]: string } = {};

  // Fetch jobs and then fetch details
  const { jobs, totalJobsCount } = await fetchJobs(filters, currentPage, searchKeyword);
  const jobsWithDetails = await Promise.all(
    jobs.map(async (job) => {
      const details = await fetchJobDetails(job.id, newPostingDates);
      return {
        ...job,
        description: details.description || job.description || '',
      };
    })
  );

  return (
    <div className="p-4">
      {/* Search Form */}
      <div className="mb-4">
        <SearchForm initialKeyword={searchKeyword} />
      </div>

      {/* Filters */}
      <div className="filters">
        <DropdownFilter
          jobCategory={jobCategoryDropdown}
          country={locationDropdown}
          industryExp={industryExpDropdown}
          jobType={jobTypeDropdown}
          currentParams={filters}
          selectedCompany={selectedCompany}
        />
      </div>

      {/* Job Cards or No Results */}
      {jobsWithDetails.length === 0 ? (
        <div className="text-center text-white mt-4">No job found for selected criteria.</div>
      ) : (
        <div className="job-list">
          {jobsWithDetails.map((job) => (
            <JobCard
              key={job.id}
              job={{
                title: job.name,
                id_icims: job.display_job_id,
                posted_date: newPostingDates[job.id] || '',
                job_path: job.canonicalPositionUrl,
                normalized_location: job.locations.join(', '),
                basic_qualifications: '',
                description: job.description,
                preferred_qualifications: '',
                responsibilities: '',
              }}
              onToggleDetails={() => console.log(`Toggled details for job ID: ${job.id}`)}
              isSelected={sp.selectedJobId === job.id}
              baseUrl=""
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalResults={totalJobsCount}
        resultsPerPage={10}
        updatedSearchParams={transformedFilters}
        disableNext={jobs.length < 10}
      />
    </div>
  );
};

export default MorganStanley;
