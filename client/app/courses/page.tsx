

import {fetchAPI} from '@/lib/api'
import CoursesPage from "./CoursesPage";

export default async function Page() {
    const response = await fetchAPI('/api/courses');

    return <CoursesPage courses={response.data} />;
}

