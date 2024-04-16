import Grid from "@/components/Grid";
import NavBar from "@/components/NavBar";

export default function Home() {
  const blogs = [
    { id: 1, title: "title", summary: "summary", author: "author", category: "category" },
    { id: 2, title: "title", summary: "summary", author: "author", category: "category" },
    { id: 3, title: "title", summary: "summary", author: "author", category: "category" },
    { id: 4, title: "title", summary: "summary", author: "author", category: "category" },
    { id: 5, title: "title", summary: "summary", author: "author", category: "category" },
    { id: 6, title: "title", summary: "summary", author: "author", category: "category" },
    { id: 7, title: "title", summary: "summary", author: "author", category: "category" },
  ];

  return (
    <>
      <NavBar />
      <Grid data={blogs} />
    </>
  );
}
