using Newtonsoft.Json;
using System.Collections.Generic;

namespace SGQ.Models;

public class ChecklistModel
{
	public string Id { get; set; }
	public string Name { get; set; }
	public string Description { get; set; }
	public List<CheckListSectionModel> Sections { get; set; }

	public ChecklistModel(string id, string name, string description, List<CheckListSectionModel> sections)
	{
		Id = id ?? System.Guid.NewGuid().ToString();
		Name = name;
		Description = description;
		Sections = sections;
	}

	public override string ToString() => JsonConvert.SerializeObject(this, Formatting.Indented);
}

public class CheckListSectionModel
{
	public string SectionName { get; set; }
	public List<ChecklistRequestModel> Requests { get; set; }
}

public class ChecklistRequestModel
{ 
	public string RequestDescription { get; set; }
	
}