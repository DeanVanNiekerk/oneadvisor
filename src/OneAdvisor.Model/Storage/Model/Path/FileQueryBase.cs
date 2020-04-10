using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Storage.Model.Path
{
    public abstract class FileQueryBase : PathBase
    {
        public FileQueryBase(DirectoryPathBase directoryPath, string fileName)
        {
            DirectoryPath = directoryPath;
            FileName = fileName;
        }

        public DirectoryPathBase DirectoryPath { get; private set; }
        public string FileName { get; private set; }

        public string GetFilePath()
        {
            var paths = new List<string>() { DirectoryPath.GetDirectoryPath(), FileName };
            return Join(paths);
        }
    }
}