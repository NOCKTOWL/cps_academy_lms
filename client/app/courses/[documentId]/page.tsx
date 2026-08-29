import { fetchAPI } from "@/lib/api";
import CoursePage from "./CoursePage";

export default async function page({ params }: { params: Promise<{ documentId: string }> }) {
  const {documentId} = await params;
  console.log('documentId', documentId);

  const response = await fetchAPI(`/api/courses/${documentId}?populate[lessons]=true`);
  console.log('response', response);

  return <CoursePage course={response.data} />
  
}
