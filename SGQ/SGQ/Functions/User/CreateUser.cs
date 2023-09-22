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
using System.Collections.Generic;
using System.Linq;
using Utils;

namespace User.Functions
{
    public static class CreateUser
    {
        [FunctionName("user-create")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req, 
            [CosmosDB(
        databaseName: "sgq",
        collectionName: "user",
        ConnectionStringSetting = "myCosmosDb")] DocumentClient client,
            [CosmosDB(
		databaseName: "sgq",
		collectionName: "user",
		ConnectionStringSetting = "myCosmosDb")]IAsyncCollector<UserModel> documentsOut, 
            ILogger log)
        {
            log.LogInformation("Create User started");

            List<UserModel> users = client.CreateDocumentQuery<UserModel>(UriFactory.CreateDocumentCollectionUri("sgq", "user")).ToList();
            List<UserModel> convertedUsers = users.Select(u => new UserModel(u.Id, u.Name, u.Email, u.Role)).ToList();
            var allowed = new Jwt().ValidateUserAndRoles(new List<UserRole> { UserRole.ADMIN }, req, users);
            if (allowed == false)
            {
                return new UnauthorizedResult();
            }

			string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var user = JsonConvert.DeserializeObject<UserModel>(requestBody);
            UserModel convertedUser = new UserModel(user.Id, user.Name, user.Email, user.Password, user.Role);

            var userExists = convertedUsers.Any(u => u.Email == convertedUser.Email);

            if (userExists == true)
            {
                return new BadRequestObjectResult("User already exists");
            }
            
            await documentsOut.AddAsync(convertedUser);

            log.LogInformation($"User id: {convertedUser.Id}");

			return new OkObjectResult(new UserModel(convertedUser.Id, convertedUser.Name, convertedUser.Email, convertedUser.Role));
        }
    }
}
