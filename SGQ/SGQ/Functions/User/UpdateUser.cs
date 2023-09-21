using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using User.Models;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using System;
using Utils;
using System.Collections.Generic;
using System.Linq;

namespace SGQ.Functions.User
{
    public static class UpdateUser
    {
        [FunctionName("user-update")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = null)] HttpRequest req, [CosmosDB(
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
            log.LogInformation("Update User started");

            List<UserModel> users = client.CreateDocumentQuery<UserModel>(UriFactory.CreateDocumentCollectionUri("sgq", "user")).ToList();
            List<UserModel> convertedUsers = users.Select(u => new UserModel(u.Id, u.Name, u.Email, u.Role)).ToList();
            var allowed = new Jwt().ValidateUserAndRoles(new List<UserRole> { UserRole.ADMIN }, req, users);
            if (allowed == false)
            {
                return new UnauthorizedResult();
            }

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var user = JsonConvert.DeserializeObject<UserModel>(requestBody);
            UserModel convertedUser = new UserModel(req.Query["id"], user.Name, user.Email, user.Password, user.Role);

            Uri collection = UriFactory.CreateDocumentCollectionUri("sgq", "user");
            await client.DeleteDocumentAsync(document.SelfLink, new RequestOptions() { PartitionKey = new PartitionKey(convertedUser.Id) });
            await client.UpsertDocumentAsync(collection, convertedUser);

            log.LogInformation($"User id: {convertedUser.Id}");

            return new OkObjectResult(user);
        }
    }
}
