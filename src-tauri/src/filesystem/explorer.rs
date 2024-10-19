use std::fs::read_dir;

use super::volume::DirectoryChild;

// Opens the directory at the given path and returns a list of its contents (files or subdirectories) as either `DirectoryChild::File` or `DirectoryChild::Directory`.
// If the directory can't be opened (e.g., it doesn't exist), it returns an empty list.
#[tauri::command]
pub async fn open_directory(path: String) -> Result<Vec<DirectoryChild>, ()> {
    let Ok(directory) = read_dir(path) else {
        return Ok(Vec::new());
    };
    Ok(
        directory
            .map(|entry| {
                let entry = entry.unwrap();
                let file_name = entry.file_name().to_string_lossy().to_string();
                let entry_is_file = entry.file_type().unwrap().is_file();
                let entry = entry.path().to_string_lossy().to_string();

                if entry_is_file {
                    return DirectoryChild::File(file_name, entry);
                }

                DirectoryChild::Directory(file_name, entry)
            })
            .collect()
    )
}