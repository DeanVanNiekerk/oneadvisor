using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using OneAdvisor.Model.Config.Options;
using OneAdvisor.Model.Storage.Interface;
using OneAdvisor.Model.Storage.Model.File;
using OneAdvisor.Model.Storage.Model.Path;

namespace OneAdvisor.Service.Storage
{
    public class FileStorageService : IFileStorageService
    {
        private CloudStorageAccount _account;

        public FileStorageService(IOptions<ConnectionOptions> options)
        {
            _account = CloudStorageAccount.Parse(options.Value.AzureStorage);
        }

        public async Task<string> AddFileAsync(FilePathBase path, Stream stream)
        {
            var client = _account.CreateCloudBlobClient();
            var container = client.GetContainerReference(path.DirectoryPath.GetContainerName());

            await container.CreateIfNotExistsAsync();

            var cloudBlockBlob = container.GetBlockBlobReference(path.GetUnqiueFilePath());

            foreach (var data in path.MetaData)
                cloudBlockBlob.Metadata.Add(data.Key, data.Value);

            await cloudBlockBlob.UploadFromStreamAsync(stream);

            return path.StorageName;
        }

        public async Task<IEnumerable<CloudFileInfo>> GetFileInfoListAsync(DirectoryPathBase path, bool includeDeleted = false)
        {
            var client = _account.CreateCloudBlobClient();
            var container = client.GetContainerReference(path.GetContainerName());

            var exists = await container.ExistsAsync();

            if (!exists)
                return new List<CloudFileInfo>();

            var directory = container.GetDirectoryReference(path.GetDirectoryPath());

            var items = new List<CloudFileInfo>();

            BlobContinuationToken blobContinuationToken = null;
            do
            {
                var results = await container.ListBlobsSegmentedAsync(directory.Prefix, true, BlobListingDetails.None, null, blobContinuationToken, null, null);
                blobContinuationToken = results.ContinuationToken;

                foreach (var result in results.Results)
                {
                    var blob = new CloudBlob(result.Uri, _account.Credentials);
                    await blob.FetchAttributesAsync();

                    var deleted = false;
                    var deletedString = "";
                    var success = blob.Metadata.TryGetValue(FilePathBase.METADATA_DELETED, out deletedString);
                    if (success)
                        deleted = Boolean.TrueString == deletedString;

                    if (!includeDeleted && deleted)
                        continue;

                    var fileName = "unknown";
                    blob.Metadata.TryGetValue(FilePathBase.METADATA_FILENAME, out fileName);

                    var file = new CloudFileInfo()
                    {
                        Name = fileName,
                        StorageName = blob.Name,
                        Size = blob.Properties.Length,
                        ContentType = blob.Properties.ContentType,
                        Created = blob.Properties.Created,
                        LastModified = blob.Properties.LastModified,
                        Url = result.Uri.AbsoluteUri,
                        Deleted = deleted,
                    };

                    items.Add(file);
                }
            }
            while (blobContinuationToken != null); // Loop while the continuation token is not null.

            return items.OrderByDescending(x => x.LastModified);
        }

        public async Task<CloudFileInfo> GetFileInfoAsync(FileQueryBase query)
        {
            var fileInfoList = await GetFileInfoListAsync(query.DirectoryPath);
            return fileInfoList.FirstOrDefault(f => f.StorageName.Contains(query.StorageName));
        }

        public async Task<string> GetFile(string url, Stream stream)
        {
            var blob = new CloudBlob(new Uri(url), _account.Credentials);

            await blob.FetchAttributesAsync();

            await blob.DownloadToStreamAsync(stream);

            return blob.Metadata[FilePathBase.METADATA_FILENAME];
        }

        public async Task SoftDeleteFile(string url)
        {
            var blob = new CloudBlob(new Uri(url), _account.Credentials);

            await blob.FetchAttributesAsync();

            blob.Metadata[FilePathBase.METADATA_DELETED] = true.ToString();

            await blob.SetMetadataAsync();
        }

        public async Task DeleteFile(string url)
        {
            var blob = new CloudBlob(new Uri(url), _account.Credentials);

            await blob.DeleteIfExistsAsync();
        }
    }
}
