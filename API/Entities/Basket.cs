namespace API.Entities;

public class Basket
{
    public int Id { get; set; }
    public string BuyerId { get; set; }
    public List<BasketItem> Items { get; set; } = new();
    public string PaymentIntentId { get; set; }
    public string ClientSecret { get; set; }

    public void AddItem(Product product, int quantity)
    {
        var item = Items.FirstOrDefault((item) => item.Product.Id == product.Id);
        if (item is null)
        {
            Items.Add(new BasketItem
            {
                Product = product, Quantity = quantity
            });
        }
        else
        {
            item.Quantity += quantity;
        }
    }

    public void RemoveItem(int productId, int quantity)
    {
        var item = Items.FirstOrDefault((item) => item.Product.Id == productId);
        if (item is null) return;

        item.Quantity -= quantity;
        if (item.Quantity < 1)
        {
            Items.Remove(item);
        }
    }
}