using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using User.Models;
using SGQ.Models;

namespace SGQ.Functions.Checklist
{
    public static class CreateChecklist
    {
        [FunctionName("checklist-create")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
			[CosmosDB(
		databaseName: "sgq",
		collectionName: "checklist",
		ConnectionStringSetting = "myCosmosDb")]IAsyncCollector<ChecklistModel> documentsOut,
			ILogger log)
		{
			log.LogInformation("Create Checklist started");

			string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
			var checklist = JsonConvert.DeserializeObject<ChecklistModel>(requestBody);
			ChecklistModel convertedChecklist = new ChecklistModel(checklist.Id, checklist.Name, checklist.Description, checklist.Sections);

			await documentsOut.AddAsync(convertedChecklist);

			log.LogInformation($"Checklist id: {convertedChecklist.Id}");

			return new OkObjectResult(convertedChecklist);
		}
    }
}
