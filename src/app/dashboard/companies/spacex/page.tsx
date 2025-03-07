import React from 'react';
import DropdownFilter from "./DropdownFilter";
import SearchForm from '../../components/SearchForm';

// Cache expiry time (2 minutes in milliseconds)
const CACHE_EXPIRY_TIME = 2 * 60 * 1000;

// Simple in-memory cache
const cache: { data?: any; timestamp?: number } = {};

// Main page component that fetches jobs based on search parameters (jobCategoryCode, countryCode, keyword)
export default async function Page({
  searchParams: rawSearchParams,
}: {
  searchParams: Promise<{ jobCategoryCode?: string; countryCode?: string; keyword?: string }>;
}) {
  // Await the promise to get the actual search parameters
  const searchParams = await rawSearchParams;
  const { jobCategoryCode, countryCode, keyword = "" } = searchParams;
  
  const currentTime = Date.now();

  // Check if cache exists and is not expired
  if (cache.data && currentTime - (cache.timestamp || 0) < CACHE_EXPIRY_TIME) {
    console.log("Fetching data from cache...");
    // Apply search filtering by title if a keyword is provided
    const filteredJobs = keyword
      ? cache.data.jobs.filter((job: { title: string }) =>
          job.title.toLowerCase().includes(keyword.toLowerCase())
        )
      : cache.data.jobs;
    return (
      <div className="p-4">
        {/* Render the SearchForm above the dropdown */}
        <div className="mb-6">
          <SearchForm initialKeyword={keyword} />
        </div>
        <DropdownFilter {...{ 
          locations: cache.data.locations.filter((loc: any): loc is string => typeof loc === "string"),
          disciplines: cache.data.disciplines.filter((disc: any): disc is string => typeof disc === "string"),
          programs: cache.data.programs.filter((prog: any): prog is string => typeof prog === "string"),
          jobs: filteredJobs 
        }} />
      </div>
    );
  }

  console.log("Fetching fresh data from API...");

  // Fetch jobs from API
  const res1 = await fetch("https://boards-api.greenhouse.io/v1/boards/spacex/jobs");
  const res2 = await fetch("https://boards-api.greenhouse.io/v1/boards/spacexglobal/jobs");

  if (!res1.ok || !res2.ok) {
    throw new Error("Failed to fetch jobs");
  }

  const data1 = await res1.json();
  const data2 = await res2.json();

  // Merge jobs arrays from both API responses
  const jobs = [...(data1.jobs || []), ...(data2.jobs || [])];

  // Define the Job type inline
  type Job = {
    id: number;
    title: string;
    absolute_url: string;
    location: { name: string };
    metadata: { id: number; name: string; value: string | string[] | null }[];
    updated_at: string;
  };

  const jobList: Job[] = jobs;

  // Extract filter data
  const locations = Array.from(new Set(jobList.map((job) => job.location.name)));
  const disciplines = Array.from(
    new Set(
      jobList.flatMap((job) =>
        job.metadata.find((meta) => meta.name === "Discipline")?.value ?? []
      )
    )
  );
  const programs = Array.from(
    new Set(
      jobList.flatMap((job) =>
        Array.isArray(
          job.metadata.find((meta) => meta.name === "Program")?.value
        )
          ? (job.metadata.find((meta) => meta.name === "Program")?.value as string[])
          : []
      )
    )
  );

  // Cache the data and timestamp
  cache.data = { locations, disciplines, programs, jobs: jobList };
  cache.timestamp = currentTime;

  // Apply search filtering by job title if keyword is provided (case-insensitive)
  const filteredJobs = keyword
    ? jobList.filter((job) => job.title.toLowerCase().includes(keyword.toLowerCase()))
    : jobList;

  return (
    <div className="p-4">
      {/* Render SearchForm for title filtering */}
      <div className="mb-6">
        <SearchForm initialKeyword={keyword} />
      </div>

      {/* Render DropdownFilter with the (filtered) jobs */}
      <DropdownFilter
        locations={locations.filter((loc): loc is string => typeof loc === "string")}
        disciplines={disciplines.filter((disc): disc is string => typeof disc === "string")}
        programs={programs.filter((prog): prog is string => typeof prog === "string")}
        jobs={filteredJobs}
      />
    </div>
  );
}
