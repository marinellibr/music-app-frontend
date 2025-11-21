import Loading from "../../components/loading/loading";
import Shimmer from "../../components/shimmer/shimmer";

export default function Error() {
  return (
    <div className="error-page--container">
      <h1>Error</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <Loading />
      <Shimmer width={200} height={40} radius={8} />
      <Shimmer width={50} height={50} radius={25} />
    </div>
  );
}
