import { Volume } from "../../types";
import LoadingPlaceholder from "../LoadingPlaceholder";
import VolumeComponent from "./VolumeComponent";

interface Props {
  volumes: Volume[];
  onClick: (mountpoint: string) => any;
}
const VolumeList = ({ volumes, onClick }: Props) => {
  return (
    <div className="space-x-4">
      {volumes.length == 0 ? (
        <LoadingPlaceholder />
      ) : (
        volumes.map((volume, idx) => (
          <VolumeComponent
            volume={volume}
            key={idx}
            onClick={() => onClick(volume.mountpoint)}
          />
        ))
      )}
    </div>
  );
};

export default VolumeList;
