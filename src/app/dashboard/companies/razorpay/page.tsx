import DropdownFilter from "./DropdownFilter";
import SearchForm from "../../components/SearchForm";

// Cache expiry time (2 minutes in milliseconds)
const CACHE_EXPIRY_TIME = 2 * 60 * 1000;

// Simple in-memory cache
const cache: { data?: any; timestamp?: number } = {};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  // Wait for the search parameters to resolve
  const resolvedSearchParams = await searchParams;
  const currentTime = Date.now();

  if (!cache.data || currentTime - (cache.timestamp || 0) >= CACHE_EXPIRY_TIME) {
    console.log("Fetching fresh data from API...");
    try {
      const res = await fetch(
        "https://boards-api.greenhouse.io/v1/boards/razorpaysoftwareprivatelimited/jobs?content=true"
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch jobs: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const jobs = data.jobs || [];

      type Metadata = {
        id: number;
        name: string;
        // For multi_select metadata, value is an array of strings.
        // For single_select metadata, value is a string.
        // In our case, we assume job locations come from the multi_select field.
        value: string[];
        value_type: string;
      };

      type Job = {
        internal_job_id: string;
        id: number;
        title: string;
        absolute_url: string;
        location: { name: string };
        updated_at: string;
        content: string;
        metadata: Metadata[];
        offices: { id: number; name: string; location: string | null }[];
        departments: {
          id: number;
          name: string;
          child_ids: number[];
          parent_id: number | null;
        }[];
        requisition_id: string;
        data_compliance: {
          type: string;
          requires_consent: boolean;
          requires_processing_consent: boolean;
          requires_retention_consent: boolean;
          retention_period: null | any;
          demographic_data_consent_applies: boolean;
        }[];
      };

      const jobList: Job[] = jobs;

      // Extract job locations from metadata[0].value.
      // Each job's metadata array is expected to have the "Job Location" field at index 0.
      const offices = Array.from(
        new Set(jobList.flatMap((job) => job.metadata[0]?.value || []))
      );

      // Collect departments from the job's departments array.
      const departments = Array.from(
        new Set(jobList.flatMap((job) => job.departments.map((dept) => dept.name)))
      );

      cache.data = { offices, departments, jobs: jobList };
      cache.timestamp = currentTime;
    } catch (error) {
      console.error("Error fetching or processing data:", error);
      return <div>Error loading data.</div>;
    }
  } else {
    console.log("Fetching data from cache...");
  }

  // Filter jobs by title if a keyword is provided.
  const keyword = resolvedSearchParams.keyword || "";
  const allJobs = cache.data.jobs;
  const filteredJobs = keyword
    ? allJobs.filter((job: { title: string }) =>
        job.title.toLowerCase().includes(keyword.toLowerCase())
      )
    : allJobs;

  return (
    <div className="p-4">
      {/* Search Form for Title Filtering */}
      <div className="mb-6">
        <SearchForm initialKeyword={keyword} />
      </div>

      {/* Render DropdownFilter with cached filter data and filtered jobs */}
      <DropdownFilter
        offices={cache.data.offices.filter(
          (office: any): office is string => typeof office === "string"
        )}
        departments={cache.data.departments.filter(
          (department: any): department is string => typeof department === "string"
        )}
        jobs={filteredJobs}
      />
    </div>
  );
}
