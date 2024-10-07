export interface ArticlesSummary {
    title: string
    comments: number
    claps: number
    views: number
}

export interface IAnalyticsResponse {
    totalPosts: number
    totalViews: number
    totalClaps: number
    totalComments: number
    articlesSummary: ArticlesSummary[]
}