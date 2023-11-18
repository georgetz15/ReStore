using API.DTOs;
using API.Entities;

namespace API.Extensions;

public static class BasketExtensions
{
    public static BasketDto ToDto(this Basket basket)
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