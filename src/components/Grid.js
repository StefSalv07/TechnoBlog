import { useEffect, useState } from "react";
import Card from "./Card";
import { useSession } from "next-auth/react";

export default function Grid(props) {
    const { data: session, status } = useSession();
    const data = props.data;
    const publishedBlogs = data.filter((blog) => blog.published == true)
        .map((blog, idx) => <Card key={idx} data={blog} />);

    const [reviewerAssignedBlogs, setReviewerAssignedBlogs] = useState([]);

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.type === 'reviewer') {
            const filteredBlogs = data.filter(blog => !blog.published && blog.reviewerNames.includes(session.user.name));

            const mappedBlogs = filteredBlogs.map((blog, idx) => <Card key={idx} data={blog} />);
            setReviewerAssignedBlogs(mappedBlogs);
        } else {
            setReviewerAssignedBlogs([]);
        }
    }, [status, session, data]);

    return (
        <>
            {reviewerAssignedBlogs.length > 0 ? (
                <>
                <div className="mt-1 p-4 max-w-screen-xl mx-auto bg-white text-black">
                    <h3 className="text-3xl font-bold">Assigned to you</h3>
                </div>
                <div className="mt-1 p-4 max-w-screen-xl mx-auto bg-white text-black grid md:grid-cols-2 lg:grid-cols-3 gap-5 justify-center">
                    {reviewerAssignedBlogs}
                </div>
                </>
            ) : null}
            <div className="mt-2 p-4 max-w-screen-xl mx-auto bg-white text-black">
                    <h3 className="text-3xl font-bold">Published Blogs</h3>
            </div>
            <div className="mt-1 p-4 max-w-screen-xl mx-auto bg-white text-black grid md:grid-cols-2 lg:grid-cols-3 gap-5 justify-center">
                {publishedBlogs}
            </div>
        </>
    );
}
