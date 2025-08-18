# New Features: Ingredients and Custom Products

## Overview
Added support for ingredient management and custom product creation, allowing users to build their own dishes.

## New Models

### 1. Ingredient Model (`ingredient.model.js`)
- Stores individual ingredients with prices
- Categories: protein, vegetable, sauce, cheese, bread, topping, other
- Admin/staff can manage ingredients

### 2. Custom Product Model (`customProduct.model.js`)
- Stores user-created products with selected ingredients
- Automatically calculates total price
- Users can save and reuse custom products

## New APIs

### Ingredients API (`/api/v1/ingredients`)
- `POST /` - Create ingredient (admin/staff only)
- `GET /` - Get all ingredients (public)
- `GET /category/:category` - Get by category
- `GET /:id` - Get by ID
- `PUT /:id` - Update ingredient (admin/staff only)
- `DELETE /:id` - Delete ingredient (admin/staff only)

### Custom Products API (`/api/v1/custom-products`)
- `POST /` - Create custom product
- `GET /my-products` - Get user's custom products
- `GET /:id` - Get by ID
- `PUT /:id` - Update custom product
- `DELETE /:id` - Delete custom product
- `POST /calculate-price` - Calculate price for ingredients (can also create order)
- `POST /order-from-ingredients` - Create delivery order directly from ingredients

## Updated Order API

Orders now support both regular products and custom products:

```json
{
  "items": [
    {
      "productType": "regular",
      "product": "product_id",
      "quantity": 1
    },
    {
      "productType": "custom", 
      "customProduct": "custom_product_id",
      "quantity": 1
    }
  ]
}
```

## Usage Flow

1. Admin creates ingredients with prices
2. User browses available ingredients
3. User creates custom product by selecting ingredients
4. User can save custom product for reuse
5. User adds custom product to order
6. Order processes both regular and custom products

## Database Changes

- Added `ingredients` collection
- Added `customproducts` collection  
- Updated `orders` collection to support custom products 