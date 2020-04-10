using System;

namespace OneAdvisor.Model.Storage.Model.Path
{
    public abstract class FileQueryBase : PathBase
    {
        public FileQueryBase(DirectoryPathBase directoryPath, string storageName)
        {
            DirectoryPath = directoryPath;
            StorageName = storageName;
        }

        public DirectoryPathBase DirectoryPath { get; private set; }
        public string StorageName { get; private set; }

    }
}