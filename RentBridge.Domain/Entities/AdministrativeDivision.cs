using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RentBridge.Domain.Entities
{
    public class AdministrativeDivision
    {
        public int Code { get; set; }
        public string Name { get; set; } = null!;
        public int? ParentCode { get; set; } // Null for provinces
        public string Level { get; set; } = "Province"; // "Province", "District", "Ward"
    }

}