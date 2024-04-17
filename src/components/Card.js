export default function Card(props) {
    const data = props.data;
    const title = data?.title;
    const summary = data?.summary;
    const author = data?.author;
    const category = data?.category;
    const content = data?.content;

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${title}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

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
            <div className="flex justify-end mt-3">
                <button onClick={() => handleDownload()} type="button" className="py-2 px-3 inline-flex items-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                    <svg className="w-3 h-3 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" /><path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" /></svg>
                    Download
                </button>
            </div>
        </a >
    );
}