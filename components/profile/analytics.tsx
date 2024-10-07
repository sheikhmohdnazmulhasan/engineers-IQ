import useAnalytics from '@/hooks/use_analytics';

export const Analytics = ({ authorId }: { authorId: string }) => {
    const { data } = useAnalytics(authorId)

    console.log(data);

    return (
        <div>
            hello Analytics
        </div>
    );
};