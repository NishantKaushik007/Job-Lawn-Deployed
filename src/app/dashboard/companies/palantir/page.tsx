import { PalantirServer } from './PalantirServer';
import SearchForm from '../../components/SearchForm';

interface Categories {
  commitment: string;
  location: string;
  team: string;
  allLocations: string[];
}

interface Lists {
  text: string;
  content: string;
}

interface Content {
  descriptionHtml: string;
  lists: Lists[];
  closingHtml: string;
}

interface Urls {
  show: string;
}

export interface Data {
  id: string;
  text: string; // Job title
  categories: Categories;
  tags: string[];
  content: Content;
  urls: Urls;
  updatedAt: string;
}

// Cache to store job data and the time it was fetched
const jobsCache: {
  data: Data[] | null;
  lastFetched: number | null;
} = {
  data: null,
  lastFetched: null,
};

// Cache expiration time (in milliseconds)
const CACHE_EXPIRATION_TIME = 60 * 1000 * 2; // 2 minutes

const fetchJobsData = async (initialJobs: Data[]) => {
  const now = Date.now();

  // Return cached data if still valid
  if (jobsCache.data && jobsCache.lastFetched && now - jobsCache.lastFetched < CACHE_EXPIRATION_TIME) {
    console.log('Returning cached jobs data');
    return jobsCache.data;
  }

  console.log('Fetching fresh jobs data');

  let allJobs: Data[] = [...initialJobs]; // Start with initial jobs
  let fetchUrl = `https://www.palantir.com/api/lever/v1/postings?state=published`;

  while (fetchUrl) {
    const res = await fetch(fetchUrl);
    const data = await res.json();

    if (data && Array.isArray(data.data)) {
      allJobs = [...allJobs, ...data.data];
    } else {
      console.error('Invalid response structure: data.data is not an array');
      break;
    }

    if (data.hasNext && data.next) {
      fetchUrl = `https://www.palantir.com/api/lever/v1/postings?state=published&offset=${encodeURIComponent(data.next)}`;
    } else {
      fetchUrl = ''; // End fetching when there is no next URL
    }
  }

  // Update the cache
  jobsCache.data = allJobs;
  jobsCache.lastFetched = now;

  return allJobs;
};

// Since page components are server components by default, we can let Next.js infer the type for searchParams.
const PalantirPage = async ({ searchParams }: { searchParams: any }) => {
  // Read the keyword parameter; if not provided, default to an empty string.
  const keyword = searchParams.keyword || "";

  // Fetch the full list of jobs
  const jobListings = await fetchJobsData([]);

  // If a keyword is provided, filter jobs by checking if the job's title (the "text" field)
  // includes the keyword (case-insensitive)
  const filteredJobs = keyword
    ? jobListings.filter((job) =>
        job.text.toLowerCase().includes(keyword.toLowerCase())
      )
    : jobListings;

  return (
    <div className="p-4">
      {/* Render the SearchForm component (client component) at the top */}
      <div className="mb-6">
        <SearchForm initialKeyword={keyword} />
      </div>

      {/* Pass filtered jobs to your PalantirServer component */}
      <PalantirServer jobs={{ data: filteredJobs, hasNext: false, next: '' }} />
    </div>
  );
};

export default PalantirPage;
