import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Skel = () => {
  return (
    <div className="">
      <div className="flex items-center gap-3">
        <Skeleton circle width={60} height={60} />
        <div>
          <Skeleton width={350} />
          <Skeleton width={350} />
        </div>
      </div>
      <Skeleton height={500} />
    </div>
  );
};

export default Skel;
