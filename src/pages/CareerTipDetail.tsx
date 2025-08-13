import Markdown from "react-markdown"
import markdownStyles from "@/components/style/markdown-styles.module.css"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Calendar, Share2 } from "lucide-react"
import { getCareerTipBySlug, type CareerTip } from "@/lib/career-tips/career-tips"

export default function CareerTipDetail () {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const tip = slug ? getCareerTipBySlug(slug) : undefined;


  const getCategoryColor = (category: CareerTip["category"]) => {
    const colors = {
      interview: "bg-blue-100 text-blue-800",
      resume: "bg-green-100 text-green-800",
      networking: "bg-purple-100 text-purple-800",
      skills: "bg-orange-100 text-orange-800",
      "career-growth": "bg-pink-100 text-pink-800",
    }
    return colors[category] || "-100 text-gray-800"
  }

  const handleShare = async () => {
    if (navigator.share && tip) {
      try {
        await navigator.share({
          title: tip.title,
          text: tip.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }


  if (!tip) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{"Career tip not found"}</h1>
            <Button onClick={() => navigate("/career-tips")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Career Tips
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button onClick={() => navigate("/career-tips")} variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Career Tips
          </Button>

          <article className="bg-muted/30 rounded-lg shadow-sm overflow-hidden">
          <div className="aspect-video w-full overflow-hidden">
              <img src={tip.image || "/placeholder.svg"} alt={tip.title} className="w-full h-full object-cover" />
            </div>
          <div className="p-8">
            <header>
              <div className="flex items-center gap-4 mb-4">
                <Badge className={getCategoryColor(tip.category)}>{tip.category.replace("-", " ")}</Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {tip.readTime} min read
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(tip.publishedAt).toLocaleDateString()}
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">{tip.title}</h1>

              <p className="text-xl text-gray-600 mb-6">{tip.excerpt}</p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {tip.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button onClick={handleShare} variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </header>

            <div className={`${markdownStyles["markdown"]}`}>
              <Markdown>{tip.content}</Markdown>
            </div>
            </div>
          </article>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Want more career tips?</h2>
            <p className="text-gray-600 mb-6">
              Explore our complete collection of career advice and professional development resources.
            </p>
            <Button onClick={() => navigate("/career-tips")} size="lg">
              View All Career Tips
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}