import { useEffect } from "react";
import SearchBar from "./components/TopBar/SearchBar";
import VolumeList from "./components/Volumes/VolumeList";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  selectDirectoryContents,
  updateDirectoryContents,
} from "./store/slices/currentDirectorySlice";
import DirectoryContents from "./components/MainBody/DirectoryContents";
import {
  selectCurrentVolume,
  selectVolumes,
  setCurrentVolume,
  setVolumes,
} from "./store/slices/volumesSlice";
import { getVolumes, openDirectory } from "./ipc";

const App = () => {
  const dispatch = useAppDispatch();
  const directoryContents = useAppSelector(selectDirectoryContents);
  const volumes = useAppSelector(selectVolumes);
  const currentVolume = useAppSelector(selectCurrentVolume);

  useEffect(() => {
    if (volumes.length > 0) {
      return;
    }
    const fetchVolumes = async () => {
      try {
        const newVolumes = await getVolumes();
        dispatch(setVolumes(newVolumes));
      } catch (error) {
        console.error("Failed to fetch volumes:", error);
      }
    };

    fetchVolumes();
  }, []);

  const handleVolumeClick = async (mountpoint: string) => {
    try {
      dispatch(setCurrentVolume(mountpoint));
      const contents = await openDirectory(mountpoint);
      dispatch(updateDirectoryContents(contents));
    } catch (error) {
      console.error("Failed to open volume: ", error);
    }
  };

  const handleDirectoryClick = async (filePath: string) => {
    try {
      const contents = await openDirectory(filePath);
      dispatch(updateDirectoryContents(contents));
    } catch (error) {
      console.error("Failed to open directory: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="mb-6 ">
        <div className="flex justify-between items-center">
          <img src="./images/disk/icon2.png" alt="Logo" className="h-12 w-12" />
          <SearchBar />
          <div className="w-10"></div>
        </div>
      </div>
      <div>
        {currentVolume === "" ? (
          <VolumeList volumes={volumes} onDoubleClick={handleVolumeClick} />
        ) : (
          <DirectoryContents
            content={directoryContents}
            onDirectoryClick={handleDirectoryClick}
          />
        )}
      </div>
    </div>
  );
};

export default App;
