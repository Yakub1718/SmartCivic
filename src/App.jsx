import { useMemo, useState } from "react";
import "./App.css";

const initialComplaints = [
  {
    id: "CIV-0001",
    type: "Open Manhole",
    location: "Ameerpet, Hyderabad, Telangana",
    severity: "Critical",
    priority: "Critical Priority",
    department: "Sanitation",
    status: "In Progress",
    date: "20 Sept 2026",
    image:
      "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=160&h=120&fit=crop",
  },
  {
    id: "CIV-0002",
    type: "Pothole / Damaged Road",
    location: "Gachibowli, Hyderabad, Telangana",
    severity: "High",
    priority: "High Priority",
    department: "Roads & Public Works",
    status: "Officer Assigned",
    date: "19 Sept 2026",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=160&h=120&fit=crop",
  },
  {
    id: "CIV-0003",
    type: "Water Leakage",
    location: "Kukatpally, Hyderabad, Telangana",
    severity: "High",
    priority: "High Priority",
    department: "Water Supply",
    status: "Department Assigned",
    date: "18 Sept 2026",
    image:
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=160&h=120&fit=crop",
  },
  {
    id: "CIV-0004",
    type: "Garbage Accumulation",
    location: "Madhapur, Hyderabad, Telangana",
    severity: "Medium",
    priority: "Medium Priority",
    department: "Sanitation",
    status: "Pending",
    date: "17 Sept 2026",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=160&h=120&fit=crop",
  },
  {
    id: "CIV-0005",
    type: "Streetlight Failure",
    location: "Kondapur, Hyderabad, Telangana",
    severity: "Low",
    priority: "Low Priority",
    department: "Electrical",
    status: "Resolved",
    date: "16 Sept 2026",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=160&h=120&fit=crop",
  },
];

const issueDepartments = {
  "Open Manhole": "Sanitation",
  "Pothole / Damaged Road": "Roads & Public Works",
  "Damaged Road": "Roads & Public Works",
  "Water Leakage": "Water Supply",
  "Garbage Accumulation": "Sanitation",
  Garbage: "Sanitation",
  "Streetlight Failure": "Electrical",
  Streetlight: "Electrical",
};

const statuses = [
  "Pending",
  "Officer Assigned",
  "Department Assigned",
  "In Progress",
  "Resolved",
];

function App() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [activePage, setActivePage] = useState("My Complaints");
  const [role, setRole] = useState("Citizen");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    severity: "",
    priority: "",
    department: "",
    type: "",
  });
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    type: "Pothole / Damaged Road",
    location: "",
    description: "",
    image: null,
    preview: "",
  });

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const searchMatch = [
        c.id,
        c.type,
        c.location,
        c.department,
        c.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      return (
        searchMatch &&
        (!filters.status || c.status === filters.status) &&
        (!filters.severity || c.severity === filters.severity) &&
        (!filters.priority || c.priority === filters.priority) &&
        (!filters.department || c.department === filters.department) &&
        (!filters.type || c.type === filters.type)
      );
    });
  }, [complaints, search, filters]);

  function updateFilter(key, value) {
    setFilters((old) => ({ ...old, [key]: value }));
  }

  function submitComplaint(e) {
    e.preventDefault();

    const nextNumber =
      Math.max(
        0,
        ...complaints.map((c) => Number(c.id.replace("CIV-", "")) || 0)
      ) + 1;

    const newComplaint = {
      id: `CIV-${String(nextNumber).padStart(4, "0")}`,
      type: form.type,
      location: form.location.trim(),
      description: form.description.trim(),
      severity: "Medium",
      priority: "Medium Priority",
      department: issueDepartments[form.type] || "Municipal Services",
      status: "Pending",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      image: form.preview || "",
    };

    setComplaints((old) => [newComplaint, ...old]);
    setForm({
      type: "Pothole / Damaged Road",
      location: "",
      description: "",
      image: null,
      preview: "",
    });

    setSearch("");
    setFilters({
      status: "",
      severity: "",
      priority: "",
      department: "",
      type: "",
    });

    setNotice(`Complaint ${newComplaint.id} submitted successfully.`);
    setActivePage("My Complaints");
  }

  function changeStatus(id, status) {
    setComplaints((old) =>
      old.map((c) => (c.id === id ? { ...c, status } : c))
    );

    setSelected((old) =>
      old && old.id === id ? { ...old, status } : old
    );

    setNotice(`${id} status updated to ${status}.`);
  }

  function updatePhoto(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotice("Please choose a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotice("Please choose an image smaller than 5 MB.");
      return;
    }

    setForm((old) => ({
      ...old,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  }

  return (
    <div className="smartcivic">
      <header className="top-nav">
        <button
          className="brand"
          onClick={() => {
            setActivePage("Dashboard");
            setSelected(null);
          }}
        >
          <span className="brand-mark">S</span>
          <span className="brand-text">
            <strong>SmartCivic</strong>
            <small>Municipal Issue Reporting</small>
          </span>
        </button>

        <nav className="main-nav">
          <button
            className={activePage === "Dashboard" ? "nav-link active" : "nav-link"}
            onClick={() => {
              setActivePage("Dashboard");
              setSelected(null);
            }}
          >
            <span>⌂</span> Dashboard
          </button>

          <button
            className={
              activePage === "Report Issue" ? "nav-link active" : "nav-link"
            }
            onClick={() => {
              setActivePage("Report Issue");
              setSelected(null);
            }}
          >
            <span>＋</span> Report Issue
          </button>

          <button
            className={
              activePage === "My Complaints" ? "nav-link active" : "nav-link"
            }
            onClick={() => {
              setActivePage("My Complaints");
              setSelected(null);
            }}
          >
            <span>☷</span> My Complaints
          </button>
        </nav>

        <div className="nav-right">
          <div className="role-switch">
            <button
              className={role === "Citizen" ? "role-active" : ""}
              onClick={() => setRole("Citizen")}
            >
              Citizen
            </button>
            <button
              className={role === "Municipal Officer" ? "role-active" : ""}
              onClick={() => setRole("Municipal Officer")}
            >
              Officer
            </button>
          </div>

          <div className="user-profile">
            <span className="user-avatar">
              {role === "Citizen" ? "C" : "O"}
            </span>
            <span className="user-name">
              <strong>{role === "Citizen" ? "Citizen Portal" : "Officer View"}</strong>
              <small>{role === "Citizen" ? "Community member" : "Municipal team"}</small>
            </span>
          </div>
        </div>
      </header>

      <main className="page-content">
        {notice && (
          <div className="notice">
            <span>{notice}</span>
            <button onClick={() => setNotice("")} aria-label="Dismiss notice">
              ×
            </button>
          </div>
        )}

        {selected ? (
          <section className="detail-page">
            <button className="back-button" onClick={() => setSelected(null)}>
              ← Back to complaints
            </button>

            <div className="page-title">
              <span className="eyebrow">COMPLAINT DETAILS</span>
              <h1>{selected.id}</h1>
              <p>Review the issue information and current municipal status.</p>
            </div>

            <div className="detail-grid">
              <article className="surface detail-main">
                {selected.image ? (
                  <img
                    className="detail-image"
                    src={selected.image}
                    alt={selected.type}
                  />
                ) : (
                  <div className="detail-placeholder">No issue photo uploaded</div>
                )}

                <h2>{selected.type}</h2>
                <p>{selected.description || "No additional description provided."}</p>

                <div className="detail-info">
                  <span>Location</span>
                  <strong>{selected.location}</strong>
                  <span>Department</span>
                  <strong>{selected.department}</strong>
                  <span>Reported date</span>
                  <strong>{selected.date}</strong>
                </div>
              </article>

              <article className="surface detail-side">
                <h2>Complaint status</h2>
                <p className="muted">Current workflow status</p>
                <StatusBadge status={selected.status} />

                <h3>Severity</h3>
                <SeverityBadge severity={selected.severity} />

                <h3>Priority</h3>
                <PriorityBadge priority={selected.priority} />

                {role === "Municipal Officer" && (
                  <>
                    <label className="field-label" htmlFor="detail-status">
                      Update status
                    </label>
                    <select
                      id="detail-status"
                      value={selected.status}
                      onChange={(e) =>
                        changeStatus(selected.id, e.target.value)
                      }
                    >
                      {statuses.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </>
                )}
              </article>
            </div>
          </section>
        ) : activePage === "Report Issue" ? (
          <section className="report-page">
            <PageHeading
              eyebrow="CITIZEN SERVICES"
              title="Report a civic issue"
              description="Help improve your neighbourhood by reporting a problem."
            />

            <form className="surface report-form" onSubmit={submitComplaint}>
              <h2>Issue information</h2>
              <p className="muted">
                Add the details below so the relevant department can review the issue.
              </p>

              <label className="field-label" htmlFor="issue-type">
                Issue category
              </label>
              <select
                id="issue-type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option>Pothole / Damaged Road</option>
                <option>Open Manhole</option>
                <option>Water Leakage</option>
                <option>Garbage Accumulation</option>
                <option>Streetlight Failure</option>
                <option>Other Civic Issue</option>
              </select>

              <label className="field-label" htmlFor="issue-location">
                Location
              </label>
              <input
                id="issue-location"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Madhapur, Hyderabad"
              />

              <label className="field-label" htmlFor="issue-description">
                Description
              </label>
              <textarea
                id="issue-description"
                required
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe the issue and nearby landmarks..."
              />

              <label className="upload-area" htmlFor="issue-photo">
                {form.preview ? (
                  <img className="upload-preview" src={form.preview} alt="Issue preview" />
                ) : (
                  <>
                    <span className="upload-icon">↑</span>
                    <strong>Upload issue photo</strong>
                    <span>Choose a JPG, PNG or WebP image (maximum 5 MB).</span>
                  </>
                )}
                <input
                  id="issue-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => updatePhoto(e.target.files?.[0])}
                />
              </label>

              <p className="muted">
                AI analysis, GPS integration, and permanent database storage will
                be connected in the next development stage.
              </p>

              <button className="primary-button" type="submit">
                Submit complaint →
              </button>
            </form>
          </section>
        ) : activePage === "Dashboard" ? (
          <Dashboard
            complaints={complaints}
            total={total}
            pending={pending}
            inProgress={inProgress}
            resolved={resolved}
            onReport={() => setActivePage("Report Issue")}
            onViewAll={() => setActivePage("My Complaints")}
            onOpen={setSelected}
          />
        ) : (
          <>
            <PageHeading
              eyebrow="CITIZEN SERVICES"
              title="My Complaints"
              description="Every complaint raised from this device, with its current municipal status."
            />

            <section className="stats-grid">
              <StatCard
                title="Total Complaints"
                value={total}
                variant="mint"
                icon="☷"
              />
              <StatCard
                title="Pending"
                value={pending}
                variant="peach"
                icon="◷"
              />
              <StatCard
                title="In Progress"
                value={inProgress}
                variant="blue"
                icon="⚙"
              />
              <StatCard
                title="Resolved"
                value={resolved}
                variant="lavender"
                icon="✓"
              />
            </section>

            <section className="surface filter-panel">
              <div className="filters-grid">
                <input
                  className="search-field"
                  placeholder="⌕  Search by ID, issue or location"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search complaints"
                />

                <FilterSelect
                  label="All statuses"
                  value={filters.status}
                  onChange={(v) => updateFilter("status", v)}
                  options={statuses}
                />

                <FilterSelect
                  label="All severities"
                  value={filters.severity}
                  onChange={(v) => updateFilter("severity", v)}
                  options={["Critical", "High", "Medium", "Low"]}
                />

                <FilterSelect
                  label="All priorities"
                  value={filters.priority}
                  onChange={(v) => updateFilter("priority", v)}
                  options={[
                    "Critical Priority",
                    "High Priority",
                    "Medium Priority",
                    "Low Priority",
                  ]}
                />

                <FilterSelect
                  label="All departments"
                  value={filters.department}
                  onChange={(v) => updateFilter("department", v)}
                  options={[
                    ...new Set(complaints.map((c) => c.department)),
                  ]}
                />

                <FilterSelect
                  label="All issue types"
                  value={filters.type}
                  onChange={(v) => updateFilter("type", v)}
                  options={[...new Set(complaints.map((c) => c.type))]}
                />

                <button
                  className="clear-filters"
                  onClick={() => {
                    setSearch("");
                    setFilters({
                      status: "",
                      severity: "",
                      priority: "",
                      department: "",
                      type: "",
                    });
                  }}
                >
                  Clear filters
                </button>
              </div>
            </section>

            <section className="surface table-panel">
              <div className="table-heading">
                <div>
                  <h2>Complaint records</h2>
                  <p>
                    Showing {filteredComplaints.length} of {total} complaints
                  </p>
                </div>
                <button
                  className="primary-button compact"
                  onClick={() => setActivePage("Report Issue")}
                >
                  + Report issue
                </button>
              </div>

              <div className="table-scroll">
                <table className="complaints-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Issue</th>
                      <th>Location</th>
                      <th>Severity</th>
                      <th>Priority</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Reported</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <strong className="complaint-id">{c.id}</strong>
                        </td>
                        <td>
                          <div className="issue-cell">
                            {c.image ? (
                              <img src={c.image} alt="" className="issue-thumb" />
                            ) : (
                              <div className="issue-thumb placeholder-thumb">S</div>
                            )}
                            <strong>{c.type}</strong>
                          </div>
                        </td>
                        <td className="location-cell">
                          <span className="location-pin">⌖</span>
                          {c.location}
                        </td>
                        <td><SeverityBadge severity={c.severity} /></td>
                        <td><PriorityBadge priority={c.priority} /></td>
                        <td className="department-cell">{c.department}</td>
                        <td><StatusBadge status={c.status} /></td>
                        <td className="date-cell">{c.date}</td>
                        <td>
                          <button
                            className="open-button"
                            onClick={() => setSelected(c)}
                          >
                            Open <span>→</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredComplaints.length === 0 && (
                  <div className="empty-state">
                    <span>⌕</span>
                    <h3>No complaints found</h3>
                    <p>Try changing your search or filters.</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        <footer className="footer">
          <span>© 2026 SmartCivic · Intelligent City Care</span>
          <span>Building cleaner cities, together.</span>
        </footer>
      </main>
    </div>
  );
}

function PageHeading({ eyebrow, title, description }) {
  return (
    <div className="page-title">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

function StatCard({ title, value, variant, icon }) {
  return (
    <article className={`stat-card ${variant}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <span>{title}</span>
        <strong>{value}</strong>
        <small>Complaint records</small>
      </div>
    </article>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function StatusBadge({ status }) {
  const className = status.toLowerCase().replaceAll(" ", "-");

  return <span className={`badge status-${className}`}>{status}</span>;
}

function SeverityBadge({ severity }) {
  return (
    <span className={`badge severity-${severity.toLowerCase()}`}>
      {severity}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const type = priority.split(" ")[0].toLowerCase();

  return <span className={`badge priority-${type}`}>{priority}</span>;
}

function Dashboard({
  complaints,
  total,
  pending,
  inProgress,
  resolved,
  onReport,
  onViewAll,
  onOpen,
}) {
  return (
    <>
      <section className="hero-banner">
        <div className="hero-copy">
          <span className="eyebrow">CIVIC INTELLIGENCE PLATFORM</span>
          <h1>A better city starts with you.</h1>
          <p>
            Report civic issues, track resolutions and help make Hyderabad
            cleaner and safer.
          </p>
          <button className="primary-button" onClick={onReport}>
            + Report an issue
          </button>
        </div>
        <div className="hero-illustration" aria-hidden="true">
          <div className="sun" />
          <div className="city-building building-a" />
          <div className="city-building building-b" />
          <div className="city-building building-c" />
          <div className="city-road" />
          <span className="city-tree">♣</span>
        </div>
      </section>

      <div className="section-heading">
        <div>
          <h2>City overview</h2>
          <p>Current complaint counts</p>
        </div>
      </div>

      <section className="stats-grid">
        <StatCard title="Total Complaints" value={total} variant="mint" icon="☷" />
        <StatCard title="Pending" value={pending} variant="peach" icon="◷" />
        <StatCard title="In Progress" value={inProgress} variant="blue" icon="⚙" />
        <StatCard title="Resolved" value={resolved} variant="lavender" icon="✓" />
      </section>

      <section className="surface table-panel">
        <div className="table-heading">
          <div>
            <h2>Recent complaints</h2>
            <p>Review the latest reported civic issues.</p>
          </div>
          <button className="text-button" onClick={onViewAll}>
            View all →
          </button>
        </div>

        <div className="table-scroll">
          <table className="complaints-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Issue</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.slice(0, 4).map((c) => (
                <tr key={c.id}>
                  <td><strong className="complaint-id">{c.id}</strong></td>
                  <td>
                    <div className="issue-cell">
                      {c.image && <img src={c.image} alt="" className="issue-thumb" />}
                      <strong>{c.type}</strong>
                    </div>
                  </td>
                  <td>{c.location}</td>
                  <td><SeverityBadge severity={c.severity} /></td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>
                    <button className="open-button" onClick={() => onOpen(c)}>
                      Open →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default App;