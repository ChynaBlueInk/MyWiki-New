export const dynamic = "force-dynamic";

import { Suspense } from "react";
import SearchComponent from "../../components/SearchComponent";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mt-4">Loading search page...</div>}>
      <SearchComponent />
    </Suspense>
  );
}
