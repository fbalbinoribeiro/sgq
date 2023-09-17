using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using User.Models;
using Microsoft.Azure.Documents.Client;
using System.Collections.Generic;
using System.Linq;

namespace SGQ.Functions.User
{
    public static class GetUsers
    {
        [FunctionName("users")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req, [CosmosDB(
        databaseName: "sgq",
        collectionName: "user",
        ConnectionStringSetting = "myCosmosDb")] DocumentClient client,
            ILogger log)
        {
            log.LogInformation("Get Users started");

            List<UserModel> users = client.CreateDocumentQuery<UserModel>(UriFactory.CreateDocumentCollectionUri("sgq", "user")).ToList();

            log.LogInformation($"Users count: {users.Count}");

            return new OkObjectResult(users);
        }
    }
}
