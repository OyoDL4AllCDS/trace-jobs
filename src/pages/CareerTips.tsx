import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, Filter } from "lucide-react"
import { getCareerTipsFiltered, type CareerTip } from "@/lib/career-tips/career-tips"

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
  const navigate = useNavigate()

 const tips = getCareerTipsFiltered(selectedCategory as CareerTip["category"] as any, searchQuery);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // handleSearch()
    }
  }

  const getCategoryColor = (category: CareerTip["category"]) => {
    const colors = {
      interview: "bg-blue-100 text-blue-800",
      resume: "bg-green-100 text-green-800",
      networking: "bg-purple-100 text-purple-800",
      skills: "bg-orange-100 text-orange-800",
      "career-growth": "bg-pink-100 text-pink-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }


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
                onKeyPress={handleKeyPress}
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
              <Card
                key={tip.id}
                className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-muted/30"
                onClick={() => navigate(`/career-tips/${tip.slug}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getCategoryColor(tip.category)}>{tip.category.replace("-", " ")}</Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {tip.readTime} min
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{tip.title}</CardTitle>
                  <CardDescription className="text-sm">{tip.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tip.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {tip.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{tip.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Published {new Date(tip.publishedAt).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}