﻿using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpdateProductDto
{
    [Required] public int Id { get; set; }
    [Required] public string Name { get; set; }
    [Required] public string Description { get; set; }

    [Required]
    [Range(100, double.PositiveInfinity)]
    public long Price { get; set; }

    public IFormFile File { get; set; }
    [Required] public string Type { get; set; }
    [Required] public string Brand { get; set; }

    [Required]
    [Range(0, double.PositiveInfinity)]
    public int QuantityInStock { get; set; }
}