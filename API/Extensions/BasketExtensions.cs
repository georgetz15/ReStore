using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class BasketExtensions
{
    public static BasketDto ToDto(this Basket basket)
    {
        return new BasketDto
        {
            BuyerId = basket.BuyerId,
            Id = basket.Id,
            PaymentIntentId = basket.PaymentIntentId,
            ClientSecret = basket.ClientSecret,
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

    public static IQueryable<Basket> RetrieveFromBuyerId(this IQueryable<Basket> query, string buyerId)
    {
        return query
            .Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .Where(b => b.BuyerId == buyerId);
    }
}