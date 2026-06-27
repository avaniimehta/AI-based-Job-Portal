import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("/jobs")
      .then(res => {
        console.log("JOBS DATA:", res.data); // 👈 check in console
        setJobs(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Jobs</h2>

      {jobs && jobs.length > 0 ? (
        jobs.map(job => (
          <div
            key={job.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "10px",
              borderRadius: "8px"
            }}
          >
            <h3>{job.title}</h3>
            <p><b>Company:</b> {job.company}</p>
            <p><b>Location:</b> {job.location}</p>
            <p><b>Type:</b> {job.type}</p>
            <p><b>Salary:</b> {job.salary}</p>
          </div>
        ))
      ) : (
        <p>No jobs found</p>
      )}
    </div>
  );
}