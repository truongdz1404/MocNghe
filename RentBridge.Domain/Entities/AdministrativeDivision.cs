using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using RentBridge.Domain.Enums;

namespace RentBridge.Domain.Entities
{
    [Table("tblAdministrativeDivisions")]
    public class AdministrativeDivision
    {
        public int Code { get; set; }
        public string Name { get; set; } = null!;
        public int? ParentCode { get; set; } // Null for provinces
        public LocationLevel Level { get; set; } = LocationLevel.Province; // "Province", "District", "Ward"
    }

}