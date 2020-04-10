using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Storage.Model.Path
{
    public abstract class FilePathBase
    {
        public static string METADATA_FILENAME = "FileName";
        public static readonly string METADATA_DELETED = "Deleted";

        public FilePathBase(DirectoryPathBase directoryPath)
            : this(directoryPath, new Dictionary<string, string>())
        { }

        public FilePathBase(DirectoryPathBase directoryPath, Dictionary<string, string> metaData)
        {
            DirectoryPath = directoryPath;
            MetaData = metaData;
            FileName = Guid.NewGuid().ToString();
        }

        public DirectoryPathBase DirectoryPath { get; private set; }
        public Dictionary<string, string> MetaData { get; private set; }
        public string FileName { get; private set; }

        //Get a new unique file path (directory plus file name)
        public string GetUnqiueFilePath()
        {
            var paths = new List<string>() { DirectoryPath.GetDirectoryPath(), FileName };
            return Join(paths);
        }

        protected string Join(IEnumerable<string> paths)
        {
            return String.Join("/", paths);
        }
    }
}