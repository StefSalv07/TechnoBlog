export default function Card(props) {
    const data = props.data;
    const title = data?.title;
    const summary = data?.summary;
    const author = data?.author;
    const category = data?.category;

    return (
        <a href="#" className="flex flex-col max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:border-black justify-between" >
            <div>
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 ">{title}</h5>
                <p className="mb-2 font-normal text-gray-700">{summary}</p>
            </div>
            <div>
                <p className="">
                    <span className="font-semibold">Author: </span>
                    {author}
                </p>
                <p className="">
                    <span className="font-semibold">Category: </span>
                    {category}
                </p>
            </div>
        </a >
    );
}