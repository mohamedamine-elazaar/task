import { useMemo } from "react";

function FilterBar({ filters, onChange }) {
  const statusOptions = useMemo(
    () => [
      { value: "all", label: "All" },
      { value: "pending", label: "Pending" },
      { value: "completed", label: "Completed" },
    ],
    []
  );

  const handleStatusChange = (event) => {
    onChange({ ...filters, status: event.target.value });
  };

  const handleSearchChange = (event) => {
    onChange({ ...filters, search: event.target.value });
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar__group">
        <label htmlFor="status-filter">Status</label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={handleStatusChange}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-bar__group filter-bar__group--grow">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="search"
          placeholder="Search by title"
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
}

export default FilterBar;
