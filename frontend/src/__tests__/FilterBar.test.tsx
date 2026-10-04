import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import FilterBar from "../components/FilterBar"
import type { JobFilters } from "../types"

const defaultFilters: JobFilters = {
  search: "",
  status: "All",
  workplaceType: "All",
  sortBy: "dateApplied",
  sortOrder: "desc",
}

describe("FilterBar Component", () => {
  it("renders search input, status options, and view mode buttons", () => {
    const onFilterChange = vi.fn()
    const onClearFilters = vi.fn()
    const onViewModeChange = vi.fn()
    const onExportCsv = vi.fn()

    render(
      <FilterBar
        filters={defaultFilters}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
        totalCount={12}
        viewMode="kanban"
        onViewModeChange={onViewModeChange}
        onExportCsv={onExportCsv}
      />
    )

    expect(screen.getByPlaceholderText(/Search by company/i)).toBeInTheDocument()
    expect(screen.getByText("Kanban")).toBeInTheDocument()
    expect(screen.getByText("Cards")).toBeInTheDocument()
    expect(screen.getByText("Table")).toBeInTheDocument()
    expect(screen.getByText(/12 jobs/i)).toBeInTheDocument()

    // Test search typing
    const searchInput = screen.getByPlaceholderText(/Search by company/i)
    fireEvent.change(searchInput, { target: { value: "Google" } })
    expect(onFilterChange).toHaveBeenCalledWith("search", "Google")
  })
})
