using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.Documents.Client;
using System.Collections.Generic;
using System.Linq;
using User.Models;
using SGQ.Models;

namespace SGQ.Functions.Checklist
{
    public static class GetChecklists
    {
        [FunctionName("checklists")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req, [CosmosDB(
		databaseName: "sgq",
		collectionName: "checklist",
		ConnectionStringSetting = "myCosmosDb")] DocumentClient client,
			ILogger log)
        {
			log.LogInformation("Get checklists started");

			List<ChecklistModel> users = client.CreateDocumentQuery<ChecklistModel>(UriFactory.CreateDocumentCollectionUri("sgq", "checklist")).ToList();

			log.LogInformation($"Checklists count: {users.Count}");

			return new OkObjectResult(users);
		}
    }
}
