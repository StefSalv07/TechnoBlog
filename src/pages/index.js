import React from 'react';
import Grid from "@/components/Grid";
import NavBar from "@/components/NavBar";

export async function getServerSideProps(context) {
  try {
    const res = await fetch('http://localhost:3000/api/articles');
    if (!res.ok) {
      throw new Error(`Failed to fetch, received status ${res.status}`);
    }
    const blogs = await res.json();
    return { props: { blogs } };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return { props: { blogs: [] } };
  }
}

export default function Home({ blogs }) {
  return (
    <>
      <NavBar />
      <Grid data={blogs} />
    </>
  );
}
