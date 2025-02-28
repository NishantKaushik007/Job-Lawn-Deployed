import JobCard from '../../components/JobCard/JobCard';
import Pagination from './Pagination';
import DropdownFilter from './DropdownFilter';
import { jobCategory, industryExp, jobType, country, postingDate } from '../../../../Data/data';
import SearchForm from '../../components/SearchForm';

interface SecondaryLocation {
  RequisitionLocationId: number;
  GeographyNodeId: number;
  GeographyId: number;
  Name: string;
  CountryCode: string;
  Latitude: number | null;
  Longitude: number | null;
}

interface Job {
  Id: string;
  Title: string;
  PostedDate: string;
  PrimaryLocation: string;
  secondaryLocations: SecondaryLocation[];
}

interface JobDetails {
  ExternalDescriptionStr: string;
  CorporateDescriptionStr: string;
  ExternalQualificationsStr: string;
  ExternalResponsibilitiesStr: string;
  Skills: string;
}

const CACHE_EXPIRY_TIME = 60 * 1000 * 2; // 2 minutes

let serverCache: Record<string, { jobs: Job[]; totalJobsCount: number }> = {};
let isClient = typeof window !== 'undefined';

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
  if (serverCache[cacheKey]) {
    console.log('Returning data from server-side cache');
    return serverCache[cacheKey];
  }
  if (isClient) {
    const cachedData = getLocalStorageWithExpiry(cacheKey);
    if (cachedData) {
      console.log('Returning data from client-side cache (localStorage)');
      return cachedData;
    }
  }
  try {
    const queryParams = [
      filters.country && `selectedLocationsFacet=${filters.country[0]}`,
      filters.jobCategory && `selectedCategoriesFacet=${filters.jobCategory[0]}`,
      filters.postingDate && `selectedPostingDatesFacet=${filters.postingDate[0]}`,
      (filters.jobType || filters.industryExp) && `selectedFlexFieldsFacets=${filters.jobType || filters.industryExp}`,
      filters.keyword && `keyword=%22${filters.keyword[0].replace(/\s+/g, '%20')}%22`,
      `limit=10`,
      `offset=${(page - 1) * 10}`,
    ]
      .filter(Boolean)
      .join(',');

    const sortBy = keyword ? 'RELEVANCY' : 'POSTING_DATES_DESC';

    const url = `https://eeho.fa.us2.oraclecloud.com/hcmRestApi/resources/latest/recruitingCEJobRequisitions?onlyData=true&expand=requisitionList.secondaryLocations,flexFieldsFacet.values,requisitionList.requisitionFlexFields&finder=findReqs;siteNumber=CX_45001,facetsList=LOCATIONS%3BWORK_LOCATIONS%3BWORKPLACE_TYPES%3BTITLES%3BCATEGORIES%3BORGANIZATIONS%3BPOSTING_DATES%3BFLEX_FIELDS,limit=200,${queryParams},sortBy=${sortBy}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    const data = await response.json();
    const jobs = data?.items?.[0]?.requisitionList || [];
    const totalJobsCount = data?.items?.[0]?.TotalJobsCount || 0;
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

const fetchJobDetails = async (jobId: string): Promise<JobDetails | null> => {
  try {
    const url = `https://eeho.fa.us2.oraclecloud.com/hcmRestApi/resources/latest/recruitingCEJobRequisitionDetails?expand=all&onlyData=true&finder=ById;siteNumber=CX_45001,Id=%22${jobId}%22`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch job details');
    }
    const data = await response.json();
    const jobDetail = data?.items?.[0];
    return {
      ExternalDescriptionStr: jobDetail?.ExternalDescriptionStr || '',
      CorporateDescriptionStr: jobDetail?.CorporateDescriptionStr || '',
      ExternalQualificationsStr: jobDetail?.ExternalQualificationsStr || '',
      ExternalResponsibilitiesStr: jobDetail?.ExternalResponsibilitiesStr || '',
      Skills: jobDetail?.Skills || '',
    };
  } catch (error) {
    console.error('Error fetching job details:', error);
    return null;
  }
}

// Change the prop type so that searchParams is a Promise.
export default async function Oracle({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  // Await searchParams to obtain a plain object.
  const sp = await Promise.resolve(searchParams);

  const {
    country: selectedCountry,
    jobCategory: selectedJobCategory,
    postingDate: selectedPostingDate,
    industryExp: selectedIndustryExp,
    jobType: selectedJobType,
    page,
    keyword,
  } = sp;

  const selectedCompany = 'Oracle';

  const jobCategoryDropdown = (jobCategory ?? []).filter((item) => item.company === selectedCompany);
  const countryDropdown = (country ?? []).filter((item) => item.company === selectedCompany);
  const postingDateDropdown = (postingDate ?? []).filter((item) => item.company === selectedCompany);
  const experienceDropdown = (industryExp ?? []).filter((item) => item.company === selectedCompany);
  const jobTypeDropdown = (jobType ?? []).filter((item) => item.company === selectedCompany);

  const filters: Record<string, string[] | undefined> = {
    country: selectedCountry ? [selectedCountry] : undefined,
    jobCategory: selectedJobCategory ? [selectedJobCategory] : undefined,
    postingDate: selectedPostingDate ? [selectedPostingDate] : undefined,
    industryExp: selectedIndustryExp ? [selectedIndustryExp] : undefined,
    jobType: selectedJobType ? [selectedJobType] : undefined,
    keyword: keyword ? [keyword] : undefined,
  };

  const transformedFilters = transformFilters(filters);
  const currentPage = parseInt(page || '1', 10);
  const searchKeyword = keyword || '';
  const { jobs, totalJobsCount } = await fetchJobs(filters, currentPage, searchKeyword);

  const jobsWithDetails = await Promise.all(
    jobs.map(async (job) => {
      const details = await fetchJobDetails(job.Id);
      return {
        ...job,
        details,
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
          country={countryDropdown}
          postingDate={postingDateDropdown}
          industryExp={experienceDropdown}
          jobType={jobTypeDropdown}
          currentParams={filters}
          selectedCompany={selectedCompany}
        />
      </div>

      {/* Job Cards or No Results Message */}
      {jobsWithDetails.length === 0 ? (
        <div className="text-center text-white mt-4">
          No job found for selected criteria.
        </div>
      ) : (
        <>
          <div className="job-list">
            {jobsWithDetails.map((job) => (
              <JobCard
                key={job.Id}
                job={{
                  title: job.Title,
                  id_icims: job.Id,
                  posted_date: job.PostedDate,
                  job_path: `https://careers.oracle.com/jobs/#en/sites/jobsearch/job/${job.Id}`,
                  normalized_location: job.PrimaryLocation,
                  basic_qualifications: job.details?.ExternalQualificationsStr || '',
                  description: job.details?.ExternalDescriptionStr || '',
                  preferred_qualifications: job.details?.ExternalResponsibilitiesStr || '',
                  responsibilities: job.details?.Skills || '',
                }}
                onToggleDetails={() => console.log(`Toggled details for job ID: ${job.Id}`)}
                isSelected={sp.selectedJobId === job.Id}
                baseUrl=""
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalResults={totalJobsCount}
            resultsPerPage={10}
            updatedSearchParams={transformedFilters}
            disableNext={jobsWithDetails.length < 10}
          />
        </>
      )}
    </div>
  );
}
