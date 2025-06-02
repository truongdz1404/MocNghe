using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;

namespace SpaceY.Application.Features.Category.Commands
{
    public class UpdateCategoryCommand : IRequest<bool>
    {
        public string Name { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public bool Visible { get; set; }
    }
}