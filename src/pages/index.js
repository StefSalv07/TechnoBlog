import Grid from "@/components/Grid";
import NavBar from "@/components/NavBar";

export default function Home() {
  const blogs = [
      {id: 1, title:"title", summary:"summary", content: "content"},
      {id: 2, title:"title", summary:"summary", content: "content"},
      {id: 3, title:"title", summary:"summary", content: "content"},
      {id: 4, title:"title", summary:"summary", content: "content"},
      {id: 5, title:"title", summary:"summary", content: "content"},
      {id: 6, title:"title", summary:"summary", content: "content"},
      {id: 7, title:"title", summary:"summary", content: "content"},
  ];

  return (
    <>
    <NavBar />
    <Grid data={blogs}/>
    </>
  );
}
