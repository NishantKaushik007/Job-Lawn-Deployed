import DropdownFilter from './DropdownFilter';
import JobCard from '../../components/JobCard/JobCard';
import Pagination from './Pagination';
import { jobCategory, industryExp, jobType, country, category, discipline } from '../../../../Data/data';
import SearchForm from '../../components/SearchForm';

interface Job {
  title: string;
  jobId: string;
  postingDate: string;
  properties: {
    locations: string[];
  };
  description: string;
  qualifications: string;
  responsibilities: string;
}

// Update the MicrosoftProps type so that searchParams is a Promise.
interface MicrosoftProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

const CACHE_EXPIRY_TIME = 60 * 1000 * 2; // 2 minutes

// Utility: Normalize search parameters – wrap each defined value in an array.
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

// --- (Assume that fetchJobs and fetchJobDetails are defined somewhere) ---

// For example, a simplified fetchJobs function:
async function fetchJobs(
  filters: Record<string, string | undefined>,
  page: number
): Promise<Job[]> {
  // Build query parameters from filters.
  const queryParams = [
    filters.jobCategory && `p=${filters.jobCategory}`,
    filters.jobType && `et=${filters.jobType}`,
    filters.country && `lc=${filters.country}`,
    filters.industryExp && `exp=${filters.industryExp}`,
    filters.category && `ws=${filters.category}`,
    filters.discipline && `d=${filters.discipline}`,
    filters.keyword && `q=${filters.keyword}`,
    `pg=${page}`,
  ]
    .filter(Boolean)
    .join('&');

  const cacheKey = `${queryParams}_${page}`;

  // (Here you could check server- or client-side caches.)
  // For brevity, we fetch directly:
  const url = `https://gcsservices.careers.microsoft.com/search/api/v1/search?${queryParams}&l=en_us&pgSz=10&o=Relevance&flt=true`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error fetching data: ${res.statusText}`);
  }
  const data = await res.json();
  const jobs: Job[] = data.operationResult?.result?.jobs || [];
  return jobs;
}

// Example fetchJobDetails function that retrieves details for an array of jobIds.
async function fetchJobDetails(jobIds: string[]): Promise<Record<string, Partial<Job>>> {
  const jobDetails: Record<string, Partial<Job>> = {};
  const detailPromises = jobIds.map(async (jobId) => {
    const detailUrl = `https://gcsservices.careers.microsoft.com/search/api/v1/job/${jobId}?lang=en_us`;
    const res = await fetch(detailUrl);
    if (res.ok) {
      const data = await res.json();
      jobDetails[jobId] = {
        description: data.operationResult.result.description || '',
        qualifications: data.operationResult.result.qualifications || '',
        responsibilities: data.operationResult.result.responsibilities || '',
      };
    }
  });
  await Promise.all(detailPromises);
  return jobDetails;
}

// The Microsoft page component – note searchParams is now a promise.
const Microsoft = async ({ searchParams }: MicrosoftProps) => {
  // Await searchParams (wrap with Promise.resolve in case it isn't already a Promise)
  const sp = await Promise.resolve(searchParams);

  const currentPage = parseInt(sp.page || '1', 10);
  const normalizedParams = normalizeParams(sp);
  const selectedCompany = 'Microsoft';

  let jobs: Job[] = [];
  let error: string | null = null;

  try {
    // Fetch jobs using the resolved search parameters.
    jobs = await fetchJobs(sp, currentPage);

    // Fetch job details concurrently.
    const jobIds = jobs.map((job) => job.jobId);
    const details = await fetchJobDetails(jobIds);

    // Merge job details into the job objects.
    jobs = jobs.map((job) => ({
      ...job,
      description: details[job.jobId]?.description || '',
      qualifications: details[job.jobId]?.qualifications || '',
      responsibilities: details[job.jobId]?.responsibilities || '',
    }));
  } catch (err) {
    error = (err as Error).message;
  }

  // Convert search parameters to a sanitized, serializable object.
  const sanitizedSearchParams = Object.entries(sp)
    .filter(([key, value]) => value)
    .reduce((acc, [key, value]) => {
      acc[key] = value as string;
      return acc;
    }, {} as Record<string, string>);

  return (
    <div className="p-4">
      {/* Search Form */}
      <div className="mb-4">
        <SearchForm initialKeyword={sp.keyword || ''} />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-col mb-6 space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 w-full">
        <DropdownFilter
          jobCategory={jobCategory}
          category={category}
          jobType={jobType}
          country={country}
          industryExp={industryExp}
          discipline={discipline}
          currentParams={normalizedParams}
          selectedCompany={selectedCompany}
        />
      </div>

      {/* Job Listings */}
      {error ? (
        <div>{error}</div>
      ) : jobs.length === 0 ? (
        <div className="text-center text-white mt-4">No job found for selected criteria.</div>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.jobId}>
              <JobCard
                job={{
                  title: job.title,
                  id_icims: job.jobId,
                  posted_date: job.postingDate,
                  job_path: `https://jobs.careers.microsoft.com/global/en/job/${job.jobId}`,
                  normalized_location: job.properties.locations.join(' | '),
                  basic_qualifications: job.qualifications,
                  description: job.description,
                  responsibilities: job.responsibilities,
                }}
                onToggleDetails={() => {}}
                isSelected={sp.jobId === job.jobId}
                baseUrl=""
              />
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        updatedSearchParams={sanitizedSearchParams}
        loading={false}
        disableNext={jobs.length < 10}
      />
    </div>
  );
};

export default Microsoft;
