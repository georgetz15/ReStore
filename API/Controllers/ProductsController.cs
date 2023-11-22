using System.Text.Json;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class ProductsController : BaseApiController
{
    private readonly StoreContext _context;
    private readonly IMapper _mapper;
    private readonly ImageService _imageService;

    public ProductsController(StoreContext context, IMapper mapper, ImageService imageService)
    {
        _context = context;
        _mapper = mapper;
        _imageService = imageService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductParams productParams)
    {
        var query = _context.Products
            .Search(productParams.SearchTerm)
            .Filter(productParams.Brands, productParams.Types)
            .Sort(productParams.OrderBy)
            .AsQueryable();

        var products = await PagedList<Product>.ToPagedList(
            query,
            productParams.PageNumber,
            productParams.PageSize);

        Response.AddPaginationHeader(products.MetaData);
        return products;
    }

    [HttpGet("{id:int}", Name = "GetProduct")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product is null) return NotFound();

        return product;
    }

    [HttpGet("filters")]
    public async Task<IActionResult> GetFilters()
    {
        var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
        var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

        return Ok(new { brands, types });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto productDto)
    {
        var product = _mapper.Map<Product>(productDto);
        if (productDto.File != null)
        {
            var uploadResult = await _imageService.AddImageAsync(productDto.File);
            if (uploadResult.Error != null)
                return BadRequest(new ProblemDetails { Title = uploadResult.Error.Message });

            product.PictureUrl = uploadResult.SecureUrl.ToString();
            product.ImageId = uploadResult.PublicId;
        }

        _context.Products.Add(product);
        var result = await _context.SaveChangesAsync() > 0;
        if (result) return CreatedAtRoute("GetProduct", new { Id = product.Id }, product);

        return BadRequest(new ProblemDetails { Title = "Problem creating new product" });
    }

    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<ActionResult<Product>> UpdateProduct([FromForm] UpdateProductDto productDto)
    {
        var product = await _context.Products.FindAsync(productDto.Id);
        if (product == null) return NotFound();

        if (productDto.File != null)
        {
            if (!string.IsNullOrEmpty(product.ImageId))
            {
                // TODO: log the failed deletion for later handling
                await _imageService.DeleteImageAsync(product.ImageId);
            }

            var uploadResult = await _imageService.AddImageAsync(productDto.File);
            if (uploadResult.Error != null)
                return BadRequest(new ProblemDetails { Title = uploadResult.Error.Message });

            product.PictureUrl = uploadResult.SecureUrl.ToString();
            product.ImageId = uploadResult.PublicId;
        }

        _mapper.Map(productDto, product);

        var result = await _context.SaveChangesAsync() > 0;
        if (result) return Ok(product);

        return BadRequest(new ProblemDetails { Title = "Problem updating product" });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        if (!string.IsNullOrEmpty(product.ImageId))
        {
            // TODO: log the failed deletion for later handling
            await _imageService.DeleteImageAsync(product.ImageId);
        }

        _context.Products.Remove(product);
        var result = await _context.SaveChangesAsync() > 0;
        if (result) return Ok();

        return BadRequest(new ProblemDetails { Title = "Problem deleting product" });
    }
}