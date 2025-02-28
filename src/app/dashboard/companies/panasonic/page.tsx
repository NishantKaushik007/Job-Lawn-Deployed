import { jobCategory, jobType, location, discipline, category } from '../../../../Data/data';
import DropdownFilter from './DropdownFilter';
import JobCard from '../../components/JobCard/JobCard';
import Pagination from './Pagination';
import SearchForm from '../../components/SearchForm'; // Import SearchForm

interface Job {
  title: string;
  req_id: string;
  posted_date: string;
  full_location: string;
  qualifications: string;
  description: string;
  responsibilities: string;
  canonical_url: string;
  salary_range: string;
}

// Update the prop type so that searchParams is a Promise.
interface PanasonicProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

// Set cache expiry time (in milliseconds)
const CACHE_EXPIRY_TIME = 60 * 1000 * 2; // 2 minutes

// Global in-memory cache object
const jobCache: Record<string, { data: Job[]; timestamp: number }> = {};

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

// Helper function to convert normalized parameters to the correct shape for the API
const transformFilters = (
  filters: Record<string, string[] | undefined>
): Record<string, string | undefined> => {
  const transformedFilters: Record<string, string | undefined> = {};
  for (const key in filters) {
    if (filters[key]) {
      transformedFilters[key] = filters[key]?.[0];
    }
  }
  return transformedFilters;
};

// Function to retrieve data from localStorage with cache expiry check
const getFromLocalStorage = (key: string): { data: Job[]; timestamp: number } | null => {
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
const saveToLocalStorage = (key: string, data: Job[]): void => {
  if (typeof window !== "undefined") {
    const cacheObject = { data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(cacheObject));
  }
};

// Fetch jobs based on filters with caching logic (hybrid caching)
async function fetchJobs(filters: Record<string, string | undefined>, page: number): Promise<Job[]> {
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

  // If no cached data, fetch from API
  const queryParams = [
    filters.keyword && `keywords=${filters.keyword}`,  // Include keyword in queryParams
    filters.location && `locations=${filters.location}`,
    filters.jobCategory && `categories=${filters.jobCategory}`,
    filters.jobType && `tags1=${filters.jobType}`,
    filters.discipline && `tags4=${filters.discipline}`,
    filters.category && `tags2=${filters.category}`,
    `page=${page}`,
  ]
    .filter(Boolean)
    .join('&');

  const url = `https://careers.na.panasonic.com/api/jobs?${queryParams}&sortBy=relevance&descending=false&internal=false`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }

    const data = await response.json();
    const jobs = data.jobs.map((job: any) => ({
      title: job.data.title,
      req_id: job.data.tags5[0],
      posted_date: job.data.posted_date,
      location_name: job.data.full_location,
      qualifications: job.data.qualifications || '',
      description: job.data.description || '',
      responsibilities: job.data.responsibilities || '',
      canonical_url: job.data.meta_data.canonical_url || '',
      salary_range: 'N/A',
    }));

    // Cache the result in both client and server caches
    saveToLocalStorage(cacheKey, jobs); // Save to localStorage
    jobCache[cacheKey] = { data: jobs, timestamp: Date.now() }; // Save to server-side cache

    console.log('Fetching fresh data');
    return jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export default async function PanasonicPage({ searchParams }: PanasonicProps) {
  // Await searchParams (wrap with Promise.resolve in case it isn't already a Promise)
  const sp = await Promise.resolve(searchParams);

  const currentPage = parseInt(sp.page || '1', 10);
  const normalizedParams = normalizeParams(sp);

  const selectedCompany = 'Panasonic';

  let jobs: Job[] = [];
  let error: string | null = null;

  // Transform normalized params to match the expected shape for the fetchJobs function
  const filters = transformFilters(normalizedParams);

  try {
    jobs = await fetchJobs(filters, currentPage);
  } catch (err) {
    error = (err as Error).message;
  }

  // Clean up search parameters and add keyword in sanitizedParams
  const sanitizedSearchParams = Object.entries(sp)
    .filter(([key, value]) => value && key !== 'status' && key !== 'value')
    .reduce((acc, [key, value]) => {
      acc[key] = value as string;
      return acc;
    }, {} as Record<string, string>);

  // Ensure the keyword is a string for the SearchForm
  const initialKeyword = Array.isArray(sp.keyword) ? sp.keyword[0] : (sp.keyword || '');

  return (
    <div className="p-4">
      <div>
        <div className='mb-4'>
          {/* Pass only initialKeyword */}
          <SearchForm initialKeyword={initialKeyword} />
        </div>
        <div>
          <DropdownFilter
            jobCategory={jobCategory}
            location={location}
            jobType={jobType}
            discipline={discipline}
            category={category}
            currentParams={normalizedParams} // Pass normalizedParams here
            selectedCompany={selectedCompany}
          />
        </div>
      </div>

      {error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : jobs.length === 0 ? (
        <div className="text-center text-white mt-4">No job found for selected criteria.</div>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.req_id}>
              <JobCard
                job={job}
                onToggleDetails={() => {}}
                isSelected={false}
                baseUrl=""
              />
            </li>
          ))}
        </ul>
      )}

      <Pagination
        currentPage={currentPage}
        updatedSearchParams={sanitizedSearchParams}
        loading={false}
        disableNext={jobs.length < 10}
      />
    </div>
  );
}
