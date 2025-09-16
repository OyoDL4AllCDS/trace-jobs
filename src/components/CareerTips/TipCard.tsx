import { type CareerTip } from "@/lib/career-tips/career-tips";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useNavigate } from "react-router-dom";

interface TipCardProps {
    tip : CareerTip
}

export default function TipCard ({ tip }: TipCardProps) {
    const navigate = useNavigate()

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
        <Card
            key={tip.id}
            className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-muted/30"
            onClick={() => navigate(`/career-tips/${tip.slug}`)}
        >
            <div className="aspect-square w-full overflow-hidden">
                <img
                    src={tip.image || "/placeholder.svg"}
                    alt={tip.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
            </div>
            <CardHeader>
                <div className="flex items-start justify-between mb-2">
                    <Badge className={getCategoryColor(tip.category)}>{tip.category.replace("-", " ")}</Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{tip.title}</CardTitle>
                <CardDescription className="text-sm">{tip.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-gray-500">Published {new Date(tip.publishedAt).toLocaleDateString()}</p>
            </CardContent>
        </Card>
    )
}