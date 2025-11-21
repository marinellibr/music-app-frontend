import "./loading.css";
import refresh from "../../assets/svg/refreshPurple.svg";

export default function Loading() {
  return (
    <div className="loading-container">
      <img src={refresh} alt="Loading" />
    </div>
  );
}
