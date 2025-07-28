import { useState } from "react";
import { Filter, MapPin, Clock, BookOpen, Building, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";

const filterCategories = {
  workArrangement: {
    title: "Work Arrangement",
    icon: Building,
    options: ["Remote", "Hybrid", "Onsite"]
  },
  jobType: {
    title: "Job Type",
    icon: Clock,
    options: ["Full-time", "Part-time", "Contract", "Internship"]
  },
  literacyLevel: {
    title: "Skill Level",
    icon: BookOpen,
    options: ["Basic", "Intermediate", "Advanced"]
  }
};

const JobFilters = ({ selectedFilters = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilter = (filter) => {
    if (!onChange) return;
    if (selectedFilters.includes(filter)) {
      onChange(selectedFilters.filter(f => f !== filter));
    } else {
      onChange([...selectedFilters, filter]);
    }
  };

  const clearAllFilters = () => {
    if (onChange) onChange([]);
  };

  return (
    <div className="w-full">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters {selectedFilters.length > 0 && `(${selectedFilters.length})`}
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <Card>
              <CardContent className="p-4">
                {/* Selected Filters Display (inside card, below header) */}
                {selectedFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedFilters.map((filter) => (
                      <Badge 
                        key={filter} 
                        variant="secondary" 
                        className="flex items-center gap-1 pr-1"
                      >
                        {filter}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground border border-2"
                          onClick={() => toggleFilter(filter)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
                <FilterContent 
                  filterCategories={filterCategories}
                  selectedFilters={selectedFilters}
                  toggleFilter={toggleFilter}
                  clearAllFilters={clearAllFilters}
                />
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <Card className="sticky top-24">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>
              {selectedFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear All
                </Button>
              )}
            </div>
            {/* Selected Filters Display (inside card, below header) */}
            {selectedFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedFilters.map((filter) => (
                  <Badge 
                    key={filter} 
                    variant="secondary" 
                    className="flex items-center gap-1 pr-1"
                  >
                    {filter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => toggleFilter(filter)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            <FilterContent 
              filterCategories={filterCategories}
              selectedFilters={selectedFilters}
              toggleFilter={toggleFilter}
              clearAllFilters={clearAllFilters}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface FilterCategory {
  title: string;
  icon: React.ElementType;
  options: string[];
}

interface FilterContentProps {
  filterCategories: Record<string, FilterCategory>;
  selectedFilters: string[];
  toggleFilter: (filter: string) => void;
  clearAllFilters: () => void;
}

const FilterContent = ({ filterCategories, selectedFilters, toggleFilter }: FilterContentProps) => {
  return (
    <div className="space-y-6">
      {Object.entries(filterCategories).map(([key, category]) => {
        const Icon = category.icon;
        return (
          <div key={key}>
            <h4 className="font-medium mb-3 flex items-center text-sm">
              <Icon className="h-4 w-4 mr-2" />
              {category.title}
            </h4>
            <div className="space-y-2">
              {category.options.map((option: string) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={selectedFilters.includes(option)}
                    onCheckedChange={() => toggleFilter(option)}
                    className="border-2"
                  />
                  <label
                    htmlFor={option}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JobFilters;