interface FilterPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { slug } = await params;

  return (
    <div>
      <h1>Filter Results</h1>
      <p>Filter slug: {slug.join(" / ")}</p>
    </div>
  );
}
