export default function Grid(props) {
    const data = props.data;
    const blogs = data.map((blog) => 
        <div key={blog.id}>
            {blog.title}
        </div>
    );

    return (
        <div className="mt-4 p-4 max-w-screen-xl mx-auto bg-white text-black grid md:grid-cols-2 lg:grid-cols-3 gap-5 justify-center">
            {blogs}
        </div>
    );
}