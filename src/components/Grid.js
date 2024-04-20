import { useEffect, useState } from "react";
import Card from "./Card";
import { useSession } from "next-auth/react";

export default function Grid(props) {
    const { data: session, status } = useSession();
    const data = props.data;

    const [publishedBlogs, setPublishedBlogs] = useState([]);
    const [reviewerAssignedBlogs, setReviewerAssignedBlogs] = useState([]);
    const [unassignedBlogs, setUnassignedBlogs] = useState([]);

    useEffect(() => {
        const published = data.filter(blog => blog.published)
            .map((blog, idx) => <Card key={idx} data={blog} />);
        setPublishedBlogs(published);

        if (status === 'authenticated') {
            const assigned = data.filter(blog => !blog.published && blog.reviewerNames && blog.reviewerNames.includes(session?.user?.name))
                .map((blog, idx) => <Card key={idx} data={blog} />);
            setReviewerAssignedBlogs(assigned);

            const unassigned = data.filter(blog => !blog.published && (!blog.reviewerNames || blog.reviewerNames.length === 0))
                .map((blog, idx) => <Card key={idx} data={blog} />);
            setUnassignedBlogs(unassigned);
        } else {
            setReviewerAssignedBlogs([]);
            setUnassignedBlogs([]);
        }
    }, [status, session, data]);

    return (
        <>
            {unassignedBlogs.length > 0 && (
                <>
                    <div className="mt-1 p-4 max-w-screen-xl mx-auto bg-white text-black">
                        <h3 className="text-3xl font-bold">Unassigned Articles</h3>
                    </div>
                    <div className="mt-1 p-4 max-w-screen-xl mx-auto bg-white text-black grid md:grid-cols-2 lg:grid-cols-3 gap-5 justify-center">
                        {unassignedBlogs}
                    </div>
                </>
            )}
            {reviewerAssignedBlogs.length > 0 && (
                <>
                    <div className="mt-1 p-4 max-w-screen-xl mx-auto bg-white text-black">
                        <h3 className="text-3xl font-bold">Assigned to You</h3>
                    </div>
                    <div className="mt-1 p-4 max-w-screen-xl mx-auto bg-white text-black grid md:grid-cols-2 lg:grid-cols-3 gap-5 justify-center">
                        {reviewerAssignedBlogs}
                    </div>
                </>
            )}
            <div className="mt-2 p-4 max-w-screen-xl mx-auto bg-white text-black">
                <h3 className="text-3xl font-bold">Published Articles</h3>
            </div>
            <div className="mt-1 p-4 max-w-screen-xl mx-auto bg-white text-black grid md:grid-cols-2 lg:grid-cols-3 gap-5 justify-center">
                {publishedBlogs}
            </div>
        </>
    );
}
