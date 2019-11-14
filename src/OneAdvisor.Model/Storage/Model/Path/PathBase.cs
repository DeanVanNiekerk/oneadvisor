using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Storage.Model.Path
{
    public abstract class PathBase
    {
        public PathBase(string fileName)
        {
            FileName = fileName;
        }

        public string FileName { get; private set; }
        public abstract string GetContainerName();
        public abstract string GetFilePath();
        public abstract string GetDirectoryPath();

        protected string Join(IEnumerable<string> paths)
        {
            return String.Join("/", paths);
        }
    }
}