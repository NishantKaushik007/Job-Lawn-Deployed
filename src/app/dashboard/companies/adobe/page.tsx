import React from 'react';
import DropdownFilter from './DropdownFilter';
import Pagination from './Pagination';
import JobCard from '../../components/JobCard/JobCard';
import SearchForm from '../../components/SearchForm';
import * as cheerio from 'cheerio';

// Import all required arrays from your data file.
import { workSite, country, location, jobType, jobCategory, category } from '../../../../Data/data';

// Updated Job interface now includes normalized_location.
interface Job {
  title: string;
  jobId: string;
  postedOn: string;
  location: string;
  normalized_location: string;
  jobLink: string;
  descriptionLink: string;
  description: string; // Required by JobCard
}

interface Facets {
  workSite?: string[];
  location?: string[];
  jobCategory?: string[];
  jobType?: string[];
  country?: string[];
  category?: string[];
}

const CACHE_EXPIRY_TIME = 2 * 60 * 1000; // 2 minutes
const RESULTS_PER_PAGE = 10;
let cachedJobs: Record<string, Job[]> = {};
let lastFetched: Record<string, number> = {};

// Fetch NVIDIA jobs from Workday using a CSRF token and facet selections.
async function fetchJobs(
  keyword: string,
  currentPage: number,
  facets: Facets
): Promise<Job[]> {
  const offset = (currentPage - 1) * RESULTS_PER_PAGE;
  const cacheKey = JSON.stringify({ keyword, currentPage, facets });

  if (cachedJobs[cacheKey] && Date.now() - lastFetched[cacheKey] < CACHE_EXPIRY_TIME) {
    console.log('Using cached data (server-side)');
    return cachedJobs[cacheKey];
  }

  // Step 1: Extract token.
  const tokenURL = "https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite";
  const tokenRes = await fetch(tokenURL);
  const tokenHTML = await tokenRes.text();
  const $ = cheerio.load(tokenHTML);

  let token: string | undefined;
  $('script').each((i, el) => {
    const scriptContent = $(el).html() || "";
    const tokenMatch = scriptContent.match(/token\s*:\s*"([^"]+)"/);
    if (tokenMatch && tokenMatch[1]) {
      token = tokenMatch[1];
      return false;
    }
  });

  if (!token) {
    console.error("Failed to extract token. Available scripts:", $('script').map((i, el) => $(el).html()).get());
    throw new Error("Token not found");
  }

  // Step 2: Build the appliedFacets payload.
  const appliedFacets: Record<string, string[]> = {};
  if (facets.workSite && facets.workSite.length > 0) {
    appliedFacets.locationHierarchy2 = facets.workSite;
  }
  if (facets.country && facets.country.length > 0) {
    appliedFacets.locationCountry = facets.country;
  }
  if (facets.location && facets.location.length > 0) {
    appliedFacets.locations = facets.location;
  }
  if (facets.jobType && facets.jobType.length > 0) {
    appliedFacets.timeType = facets.jobType;
  }
  if (facets.jobCategory && facets.jobCategory.length > 0) {
    appliedFacets.jobFamilyGroup = facets.jobCategory;
  }
  if (facets.category && facets.category.length > 0) {
    appliedFacets.workerSubType = facets.category;
  }

  const limit = Object.keys(appliedFacets).length === 0 ? 10 : RESULTS_PER_PAGE;

  const payload = {
    appliedFacets: appliedFacets, // {} if no filters applied.
    limit: limit,
    offset: offset,
    searchText: keyword || ""
  };

  const jobsEndpoint = "https://adobe.wd5.myworkdayjobs.com/wday/cxs/adobe/external_experienced/jobs";
  const jobURLWithToken = `${jobsEndpoint}?X-CALYPSO-CSRF-TOKEN=${token}`;
  const jobRes = await fetch(jobURLWithToken, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await jobRes.json();

  // Map job postings and construct detail & description URLs.
  const jobs: Job[] = data.jobPostings.map((job: any) => {
    return {
      title: job.title,
      jobId: job.bulletFields[0],
      postedOn: job.postedOn,
      location: job.locationsText, // fallback value
      normalized_location: job.locationsText, // initial fallback
      jobLink: `https://adobe.wd5.myworkdayjobs.com/en-US/external_experienced${job.externalPath}`,
      descriptionLink: `https://adobe.wd5.myworkdayjobs.com/wday/cxs/adobe/external_experienced${job.externalPath}`,
      description: ""
    };
  });

  // For each job, fetch detailed job information to extract jobDescription and normalized_location.
  const jobsWithDescription: Job[] = await Promise.all(
    jobs.map(async (job) => {
      try {
        const detailRes = await fetch(job.descriptionLink);
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          const description = detailData.jobPostingInfo?.jobDescription || "";
          // Extract base location from detail and additionalLocations.
          const baseLocation = detailData.jobPostingInfo?.location || "";
          const additionalLocations: string[] = detailData.jobPostingInfo?.additionalLocations || [];
          const normalized_location = additionalLocations.length > 0
            ? `${baseLocation} | ${additionalLocations.join(' | ')}`
            : baseLocation;
          return { ...job, description, normalized_location };
        }
      } catch (error) {
        console.error(`Failed to fetch details for job ${job.jobId}`, error);
      }
      return { ...job, description: "" };
    })
  );

  cachedJobs[cacheKey] = jobsWithDescription;
  lastFetched[cacheKey] = Date.now();
  console.log('Fetching fresh data');
  return jobsWithDescription;
}

const Page = async ({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) => {
  // Await searchParams.
  const resolvedSearchParams = await searchParams;
  const keyword = resolvedSearchParams.keyword || "";
  const currentPage = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 1;

  // Extract facet values from URL and convert them into arrays.
  const selectedWorkSite = resolvedSearchParams.workSite ? resolvedSearchParams.workSite.split(',') : undefined;
  const selectedLocation = resolvedSearchParams.location ? resolvedSearchParams.location.split(',') : undefined;
  const selectedJobCategory = resolvedSearchParams.jobCategory ? resolvedSearchParams.jobCategory.split(',') : undefined;
  const selectedJobType = resolvedSearchParams.jobType ? resolvedSearchParams.jobType.split(',') : undefined;
  const selectedCountry = resolvedSearchParams.country ? resolvedSearchParams.country.split(',') : undefined;
  const selectedCategory = resolvedSearchParams.category ? resolvedSearchParams.category.split(',') : undefined;

  // Build facets object.
  const facets: Facets = {
    workSite: selectedWorkSite,
    location: selectedLocation,
    jobCategory: selectedJobCategory,
    jobType: selectedJobType,
    country: selectedCountry,
    category: selectedCategory,
  };

  // Fetch jobs using the facets.
  const jobs: Job[] = await fetchJobs(keyword, currentPage, facets);
  const selectedCompany = "Adobe";

  // Build currentParams for DropdownFilter (values as arrays).
  const currentParams: Record<string, string[] | undefined> = {
    keyword: keyword ? [keyword] : undefined,
    page: resolvedSearchParams.page ? [resolvedSearchParams.page] : undefined,
    workSite: selectedWorkSite,
    location: selectedLocation,
    jobCategory: selectedJobCategory,
    jobType: selectedJobType,
    country: selectedCountry,
    category: selectedCategory,
  };

  // Clean URL parameters.
  const cleanParams = Object.fromEntries(
    Object.entries(resolvedSearchParams).filter(
      ([, value]) => value !== undefined && value !== null && value !== 'null'
    )
  );

  const toggleJobDetails = (jobId: string) => jobId; // Placeholder

  return (
    <div className="p-4">
      <div className="mb-4">
        <SearchForm initialKeyword={keyword} />
      </div>

      <div className="flex flex-col mb-6 space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 w-full">
        <DropdownFilter
          workSite={workSite}
          location={location}
          jobCategory={jobCategory}
          jobType={jobType}
          country={country}
          category={category}
          selectedCompany={selectedCompany}
          currentParams={currentParams}
        />
      </div>

      {jobs.length === 0 ? (
        <p className="text-center text-white mt-4">No job found for selected criteria</p>
      ) : (
        <ul>
          {jobs.map((job: Job) => (
            <li key={job.jobId}>
              <JobCard
                job={{
                  title: job.title,
                  id_icims: job.jobId,
                  posted_date: job.postedOn,
                  job_path: job.jobLink,
                  normalized_location: job.normalized_location,
                  basic_qualifications: 'N/A',
                  description: job.description,
                  responsibilities: 'N/A',
                }}
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
        updatedSearchParams={cleanParams}
        loading={false}
        disableNext={jobs.length < RESULTS_PER_PAGE}
      />
    </div>
  );
};

export default Page;
