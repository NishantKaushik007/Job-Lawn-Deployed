import { jobCategory, industryExp, category, discipline, location, experienceLevel, skills } from '../../../../Data/data';
import DropdownFilter from './DropdownFilter';
import JobCard from '../../components/JobCard/JobCard';
import Pagination from './Pagination';
import SearchForm from '../../components/SearchForm';

interface Job {
  title: string;
  id: string;
  req_id: string;
  posted_date: string;
  location_name: string[];
  canonical_url: string;
  description?: string;
}

const CACHE_EXPIRY_TIME = 2 * 60 * 1000; // 2 minutes
const jobCache: Record<string, { data: Job[]; timestamp: number }> = {};

// Helper to normalize search parameters
const normalizeParams = (searchParams: Record<string, string | undefined>): Record<string, string[] | undefined> => {
  return Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [key, value ? [decodeURIComponent(value)] : undefined])
  );
};

// Transform filters for the API
const transformFilters = (filters: Record<string, string[] | undefined>): Record<string, string | undefined> => {
  return Object.fromEntries(
    Object.entries(filters).map(([key, value]) => [key, value ? value[0] : undefined])
  );
};

// Cache handling functions
const getFromLocalStorage = (key: string): { data: Job[]; timestamp: number } | null => {
  if (typeof window === 'undefined') return null;
  const cachedData = localStorage.getItem(key);
  if (cachedData) {
    const parsedData = JSON.parse(cachedData);
    if (Date.now() - parsedData.timestamp < CACHE_EXPIRY_TIME) return parsedData;
  }
  return null;
};

const saveToLocalStorage = (key: string, data: Job[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  }
};

// Fetch jobs with hybrid caching and filtering
const fetchJobs = async (filters: Record<string, string | undefined>, page: number): Promise<Job[]> => {
  const cacheKey = JSON.stringify(filters);
  const resultsPerPage = 10;

  // Check localStorage cache
  const cachedClientData = getFromLocalStorage(cacheKey);
  if (cachedClientData) {
    console.log("Using client-side cached data.");
    return cachedClientData.data;
  }

  // Check in-memory cache
  const cachedServerData = jobCache[cacheKey];
  if (cachedServerData && Date.now() - cachedServerData.timestamp < CACHE_EXPIRY_TIME) {
    console.log("Using server-side cached data.");
    return cachedServerData.data;
  }

  const encodeQueryParam = (param: string) => {
    return encodeURIComponent(param).replace(/%2B/g, '+');
  };
  
  // Build API query with all filters
  const queryParams = [
    filters.keyword && `query=${filters.keyword}`,
    filters.location && `location=${encodeQueryParam(filters.location)}`,
    filters.skills && `Select+Skills=${encodeQueryParam(filters.skills)}`,
    filters.discipline && `Select+Primary+Career+Areas=${encodeQueryParam(filters.discipline)}`,
    filters.jobCategory && `Select+Secondary+Career+Areas=${encodeQueryParam(filters.jobCategory)}`,
    filters.experienceLevel && `Role+Type=${encodeQueryParam(filters.experienceLevel)}`,
    filters.industryExp && `Select+Seniority=${encodeQueryParam(filters.industryExp)}`,
    filters.category && `Select+Work+Location=${encodeQueryParam(filters.category)}`,
    `start=${(page - 1) * resultsPerPage}`,
    `num=${resultsPerPage}`,
  ]
    .filter(Boolean)
    .join('&');

  const url = `https://aexp.eightfold.ai/api/apply/v2/jobs?domain=aexp.com&${queryParams}&triggerGoButton=false`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    const data = await response.json();

    if (!data.positions || !Array.isArray(data.positions)) {
      throw new Error('API response is missing positions.');
    }

    const jobs = data.positions.map((position: any) => ({
      title: position.name || 'N/A',
      req_id: position.display_job_id || 'N/A',
      id: position.id || 'N/A',
      posted_date: position.t_create ? new Date(position.t_create * 1000).toISOString() : 'N/A',
      location_name: position.locations || ['Unknown Location'],
      canonical_url: position.canonicalPositionUrl || '',
    }));

    saveToLocalStorage(cacheKey, jobs);
    jobCache[cacheKey] = { data: jobs, timestamp: Date.now() };
    console.log("Getting fresh data from API.");
    return jobs;
  } catch (error) {
    console.error('Fetch Jobs Error:', error);
    return [];
  }
};

// Fetch job details
const fetchJobDetails = async (jobId: string) => {
  const aiResumeUrl = `https://aexp.eightfold.ai/api/apply/v2/jobs/${jobId}?domain=aexp.com`;

  try {
    const response = await fetch(aiResumeUrl);
    if (!response.ok) {
      throw new Error(`Error fetching job details: ${response.statusText}`);
    }
    const jobDetails = await response.json();
    return jobDetails.job_description || '';
  } catch (error) {
    console.error('Error fetching job details:', error);
    return '';
  }
};

// Server-side component with Option 2 applied
export default async function AmericanExpressPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const normalizedParams = normalizeParams(resolvedSearchParams);
  const filters = transformFilters(normalizedParams);

  let jobs: Job[] = [];
  let error: string | null = null;

  try {
    jobs = await fetchJobs(filters, currentPage);

    // Fetch job details for each job asynchronously
    for (let job of jobs) {
      job.description = await fetchJobDetails(job.id);
    }
  } catch (err) {
    error = (err as Error).message;
  }

  return (
    <div className="p-4">
      <div className="flex flex-col mb-6 space-y-4">
        <SearchForm initialKeyword={resolvedSearchParams.keyword || ''} />
        <DropdownFilter
          jobCategory={jobCategory}
          location={location}
          industryExp={industryExp}
          category={category}
          discipline={discipline}
          experienceLevel={experienceLevel}
          skills={skills}
          currentParams={normalizedParams}
          selectedCompany="American Express"
        />
      </div>

      {error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : jobs.length === 0 ? (
        <div className="text-center text-white mt-4">No job found for selected criteria.</div>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id}>
              <JobCard
                job={{
                  title: job.title,
                  id_icims: job.req_id,
                  posted_date: job.posted_date,
                  description: job.description || '',
                  job_path: job.canonical_url,
                  normalized_location: job.location_name.join(', '),
                }}
                onToggleDetails={() => {}}
                isSelected={resolvedSearchParams.selectedJobId === job.id}
                baseUrl=""
              />
            </li>
          ))}
        </ul>
      )}

      <Pagination currentPage={currentPage} updatedSearchParams={resolvedSearchParams} disableNext={jobs.length < 10} />
    </div>
  );
}
