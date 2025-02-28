import DropdownFilter from './DropdownFilter'; // Reusable DropdownFilter component
import JobCard from '../../components/JobCard/JobCard';
import Pagination from './Pagination'; // Updated Pagination component that accepts loading/disableNext props
import { jobCategory, country } from '../../../../Data/data'; // Import data for dropdowns

interface JobListing {
  portalJobPost: {
    portalId: string;
    portalUrl: string;
    id: string;
    updatedDate: string;
  };
  id: string;
  portalId: number;
  title: string;
  type: string;
  locations: string[];
  category: string;
  overview: string;
  responsibilities: string;
  qualifications: string;
  applyUrl: string;
}

// Update props so that searchParams is a Promise
interface AtlassianProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

const CACHE_EXPIRY_TIME = 60 * 1000 * 2; // 2 minutes

// Global in-memory cache object
const jobCache: Record<string, { data: JobListing[]; timestamp: number }> = {};

// Normalize search params to wrap values in arrays
const normalizeParams = (
  searchParams: Record<string, string | undefined>
): Record<string, string[] | undefined> => {
  const normalizedParams: Record<string, string[] | undefined> = {};
  for (const key in searchParams) {
    if (searchParams[key]) {
      normalizedParams[key] = [searchParams[key] as string];
    }
  }
  return normalizedParams;
};

// Function to retrieve data from localStorage with cache expiry check
const getFromLocalStorage = (
  key: string
): { data: JobListing[]; timestamp: number } | null => {
  if (typeof window !== "undefined") {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_EXPIRY_TIME) {
        return { data, timestamp };
      }
    }
  }
  return null;
};

// Function to save data to localStorage
const saveToLocalStorage = (key: string, data: JobListing[]): void => {
  if (typeof window !== "undefined") {
    const cacheObject = { data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(cacheObject));
  }
};

// Fetch jobs data with caching logic
const fetchJobs = async (
  filters: Record<string, string | undefined>,
  page: number
): Promise<JobListing[]> => {
  const cacheKey = JSON.stringify(filters);

  // Check client-side cache (localStorage) first
  const cachedClientData = getFromLocalStorage(cacheKey);
  if (cachedClientData) {
    console.log('Using client-side cached data');
    return cachedClientData.data;
  }

  // Check server-side cache if client-side cache is unavailable
  const cachedServerData = jobCache[cacheKey];
  if (cachedServerData && Date.now() - cachedServerData.timestamp < CACHE_EXPIRY_TIME) {
    console.log('Using server-side cached data');
    return cachedServerData.data;
  }

  // Build API query parameters
  const queryParams = [
    filters.jobCategory && `category=${filters.jobCategory}`,
    filters.country && `country=${filters.country}`,
    `page=${page}`,
    `results_per_page=10`,
  ]
    .filter(Boolean)
    .join('&');

  const url = `https://www.atlassian.com/endpoint/careers/listings?${queryParams}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.statusText}`);
    }
    const data = await res.json();

    // Cache the result in both client and server caches
    saveToLocalStorage(cacheKey, data);
    jobCache[cacheKey] = { data, timestamp: Date.now() };

    console.log('Fetching fresh data');
    return data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

const Atlassian = async ({ searchParams }: AtlassianProps) => {
  // Await the promise to resolve searchParams
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const resultsPerPage = 10;

  const normalizedParams = normalizeParams(resolvedSearchParams);
  const filters = Object.fromEntries(
    Object.entries(normalizedParams).map(([key, value]) => [key, value ? value[0] : undefined])
  );

  let jobs: JobListing[] = [];
  try {
    jobs = await fetchJobs(filters, currentPage);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return <div>Error loading jobs. Please try again later.</div>;
  }

  // Aggregate jobs to handle multiple locations
  const jobsMap = jobs.reduce<{ [key: string]: JobListing & { locations: string[] } }>((acc, job) => {
    if (!acc[job.id]) {
      acc[job.id] = { ...job, locations: [job.locations[0]] };
    } else {
      acc[job.id].locations.push(job.locations[0]);
    }
    return acc;
  }, {});
  const aggregatedJobs = Object.values(jobsMap);

  // Filter jobs based on resolvedSearchParams
  const filteredJobs = aggregatedJobs.filter((job) => {
    const matchesCategory = resolvedSearchParams.jobCategory
      ? job.category === resolvedSearchParams.jobCategory
      : true;
    const matchesLocation = resolvedSearchParams.country
      ? job.locations.some((loc) =>
          new RegExp(resolvedSearchParams.country!, 'i').test(loc)
        )
      : true;
    return matchesCategory && matchesLocation;
  });

  // Pagination logic
  const indexOfLastJob = currentPage * resultsPerPage;
  const indexOfFirstJob = indexOfLastJob - resultsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Set selectedCompany internally
  const selectedCompany = "Atlassian";

  return (
    <div className="p-4">
      {/* Dropdown Filters */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <DropdownFilter
          label="Departments"
          options={jobCategory.filter((opt) => opt.company === selectedCompany)}
          searchParamsKey="jobCategory"
          currentValue={resolvedSearchParams.jobCategory}
        />
        <DropdownFilter
          label="Locations"
          options={country.filter((opt) => opt.company === selectedCompany)}
          searchParamsKey="country"
          currentValue={resolvedSearchParams.country}
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
                  id_icims: job.id.toString(),
                  job_path: job.portalJobPost.portalUrl,
                  postingDate: job.portalJobPost.updatedDate,
                  normalized_location: job.locations.join(' | '),
                  basic_qualifications: job.qualifications || '',
                  description: job.overview || '',
                  preferred_qualifications: '',
                  responsibilities: job.responsibilities || '',
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
        disableNext={filteredJobs.length < 10}
      />
    </div>
  );
};

export default Atlassian;
