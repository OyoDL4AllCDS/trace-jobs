import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { getCareerTipsFiltered, type CareerTip } from "@/lib/career-tips/career-tips"
import TipCard from "@/components/CareerTips/TipCard"

const categories = [
  { value: "all", label: "All Tips" },
  { value: "interview", label: "Interview" },
  { value: "resume", label: "Resume" },
  { value: "networking", label: "Networking" },
  { value: "skills", label: "Skills" },
  { value: "career-growth", label: "Career Growth" },
]

export default function CareerTips() {
  const [searchQuery, setSearchQuery] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

 const tips = getCareerTipsFiltered(selectedCategory as CareerTip["category"] as any, searchQuery);

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 sm:px-6 py-8">

        <div className="text-center my-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Career Tips</h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Expert advice to accelerate your tech career. From interview preparation to career growth strategies.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 h-4 w-4" />
              <Input
                placeholder="Search career tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="sm:w-auto">
              Search
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Filter className="h-4 w-4 text-white mt-2" />
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

          {tips.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No career tips found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip) => (
              <TipCard tip={tip} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}