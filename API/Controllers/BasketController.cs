using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class BasketController : BaseApiController
{
    private readonly StoreContext _context;

    public BasketController(StoreContext context)
    {
        _context = context;
    }

    [HttpGet(Name = "GetBasket")]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basket = await FindBasket();

        if (basket is null) return NotFound();

        return MapBasketToDto(basket);
    }

    [HttpPost]
    public async Task<ActionResult> AddItemToBasket(int productId, int quantity)
    {
        // get basket
        var basket = await FindBasket() ?? await CreateBasket();
        var product = await _context.Products.FindAsync(productId);
        if (product is null) return BadRequest(new ProblemDetails { Title = "Product not found" });
        basket.AddItem(product, quantity);

        var result = await _context.SaveChangesAsync() > 0;
        if (result) return CreatedAtRoute("GetBasket", MapBasketToDto(basket));

        return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
    }

    [HttpDelete]
    public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
    {
        var basket = await FindBasket();
        if (basket is null) return NotFound();
        basket.RemoveItem(productId, quantity);

        var result = await _context.SaveChangesAsync() > 0;
        if (result) return Ok();

        return BadRequest(new ProblemDetails { Title = "Problem removing item from basket" });
    }

    private async Task<Basket> FindBasket()
    {
        return await _context.Baskets
            .Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
    }

    private async Task<Basket> CreateBasket()
    {
        var buyerId = Guid.NewGuid().ToString();
        var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
        Response.Cookies.Append("buyerId", buyerId, cookieOptions);

        var basket = new Basket { BuyerId = buyerId };
        await _context.Baskets.AddAsync(basket);
        return basket;
    }

    private static BasketDto MapBasketToDto(Basket basket)
    {
        return new BasketDto
        {
            BuyerId = basket.BuyerId,
            Id = basket.Id,
            Items = basket.Items.Select(item => new BasketItemDto
            {
                ProductId = item.Product.Id,
                Brand = item.Product.Brand,
                Name = item.Product.Name,
                PictureUrl = item.Product.PictureUrl,
                Price = item.Product.Price,
                Quantity = item.Quantity,
                Type = item.Product.Type,
            }).ToList()
        };
    }
}