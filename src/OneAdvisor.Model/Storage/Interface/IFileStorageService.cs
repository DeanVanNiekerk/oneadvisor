using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using OneAdvisor.Model.Storage.Model.File;
using OneAdvisor.Model.Storage.Model.Path;

namespace OneAdvisor.Model.Storage.Interface
{
    public interface IFileStorageService
    {
        Task<string> AddFileAsync(FilePathBase path, Stream stream);
        Task<IEnumerable<CloudFileInfo>> GetFileInfoListAsync(DirectoryPathBase path, bool includeDeleted = false);
        Task<CloudFileInfo> GetFileInfoAsync(FileQueryBase query);
        Task<string> GetFile(string url, Stream stream);
        Task DeleteFile(string url);
        Task SoftDeleteFile(string url);
    }
}