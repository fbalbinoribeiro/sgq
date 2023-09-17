using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents;

namespace User.Functions
{
    public static class DeleteUser
    {
        [FunctionName("user-delete")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = null)] HttpRequest req,
			 [CosmosDB(
			databaseName: "sgq",
			collectionName: "user", 
			Id = "{Query.id}",
			PartitionKey = "{Query.id}",
			ConnectionStringSetting = "myCosmosDb")] Document document,
			[CosmosDB(
		databaseName: "sgq",
		collectionName: "user",
		ConnectionStringSetting = "myCosmosDb")] DocumentClient client,
			ILogger log)
        {
			log.LogInformation("Delete Users started");

			string id = req.Query["id"];

			await client.DeleteDocumentAsync(document.SelfLink, new RequestOptions() { PartitionKey = new PartitionKey(id) });

			log.LogInformation($"User deleted");

			return new OkResult();
		}
    }
}
