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
using Microsoft.Azure.Documents;
using SGQ.Models;

namespace SGQ.Functions.Checklist
{
	public static class UpdateChecklist
	{
		[FunctionName("checklist-update")]
		public static async Task<IActionResult> Run(
			[HttpTrigger(AuthorizationLevel.Function, "put", Route = null)] HttpRequest req, [CosmosDB(
		databaseName: "sgq",
		collectionName: "checklist",
		Id = "{Query.id}",
		PartitionKey = "{Query.id}",
		ConnectionStringSetting = "myCosmosDb")] Document document,
			[CosmosDB(
		databaseName: "sgq",
		collectionName: "checklist",
		ConnectionStringSetting = "myCosmosDb")] DocumentClient client,
			ILogger log)
		{
			log.LogInformation("Update Checklist started");

			string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
			var checklist = JsonConvert.DeserializeObject<ChecklistModel>(requestBody);
			ChecklistModel convertedChecklist = new ChecklistModel(req.Query["id"], checklist.Name, checklist.Description, checklist.Sections);

			Uri collection = UriFactory.CreateDocumentCollectionUri("sgq", "checklist");
			await client.DeleteDocumentAsync(document.SelfLink, new RequestOptions() { PartitionKey = new PartitionKey(convertedChecklist.Id) });
			await client.UpsertDocumentAsync(collection, convertedChecklist);

			log.LogInformation($"Checklist id: {convertedChecklist.Id}");

			return new OkObjectResult(checklist);
		}
	}
}