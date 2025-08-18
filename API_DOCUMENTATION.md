# Restaurant API Documentation

## New Features: Ingredients and Custom Products

### Overview
This API now supports ingredient management and custom product creation, allowing users to build their own dishes by selecting from available ingredients.

## Ingredients API

### Base URL: `/api/v1/ingredients`

#### 1. Create Ingredient (Admin/Staff Only)
**POST** `/api/v1/ingredients`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Chicken Breast",
  "price": 15.99,
  "description": "Fresh chicken breast",
  "category": "protein",
  "image": "https://example.com/chicken.jpg"
}
```

**Categories:** `protein`, `vegetable`, `sauce`, `cheese`, `bread`, `topping`, `other`

**Response:**
```json
{
  "message": "Ingredient created successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Chicken Breast",
    "price": 15.99,
    "description": "Fresh chicken breast",
    "category": "protein",
    "available": true,
    "image": "https://example.com/chicken.jpg",
    "createdBy": "60f7b3b3b3b3b3b3b3b3b3b4",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Get All Ingredients
**GET** `/api/v1/ingredients`

**Query Parameters:**
- `category`: Filter by category
- `available`: Filter by availability (true/false)
- `search`: Search by name

**Example:** `GET /api/v1/ingredients?category=protein&available=true&search=chicken`

**Response:**
```json
{
  "message": "Ingredients retrieved successfully",
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Chicken Breast",
      "price": 15.99,
      "description": "Fresh chicken breast",
      "category": "protein",
      "available": true,
      "image": "https://example.com/chicken.jpg",
      "createdBy": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "name": "Admin User"
      }
    }
  ]
}
```

#### 3. Get Ingredients by Category
**GET** `/api/v1/ingredients/category/:category`

**Response:**
```json
{
  "message": "Ingredients retrieved successfully",
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Chicken Breast",
      "price": 15.99,
      "category": "protein"
    }
  ]
}
```

#### 4. Get Ingredient by ID
**GET** `/api/v1/ingredients/:id`

#### 5. Update Ingredient (Admin/Staff Only)
**PUT** `/api/v1/ingredients/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:** Same as create ingredient

#### 6. Delete Ingredient (Admin/Staff Only)
**DELETE** `/api/v1/ingredients/:id`

**Headers:**
```
Authorization: Bearer <token>
```

## Custom Products API

### Base URL: `/api/v1/custom-products`

#### 1. Create Custom Product
**POST** `/api/v1/custom-products`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "My Custom Burger",
  "description": "A delicious custom burger",
  "ingredients": [
    {
      "ingredient": "60f7b3b3b3b3b3b3b3b3b3b3",
      "quantity": 1
    },
    {
      "ingredient": "60f7b3b3b3b3b3b3b3b3b3b4",
      "quantity": 2
    }
  ]
}
```

**Response:**
```json
{
  "message": "Custom product created successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
    "name": "My Custom Burger",
    "description": "A delicious custom burger",
    "totalPrice": 25.98,
    "ingredients": [
      {
        "ingredient": {
          "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
          "name": "Chicken Breast",
          "price": 15.99,
          "category": "protein"
        },
        "quantity": 1
      }
    ],
    "createdBy": "60f7b3b3b3b3b3b3b3b3b3b4",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Get User's Custom Products
**GET** `/api/v1/custom-products/my-products`

**Headers:**
```
Authorization: Bearer <token>
```

#### 3. Get Custom Product by ID
**GET** `/api/v1/custom-products/:id`

**Headers:**
```
Authorization: Bearer <token>
```

#### 4. Update Custom Product
**PUT** `/api/v1/custom-products/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:** Same as create custom product

#### 5. Delete Custom Product (Soft Delete)
**DELETE** `/api/v1/custom-products/:id`

**Headers:**
```
Authorization: Bearer <token>
```

#### 6. Calculate Custom Product Price
**POST** `/api/v1/custom-products/calculate-price`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "ingredients": [
    {
      "ingredient": "60f7b3b3b3b3b3b3b3b3b3b3",
      "quantity": 1
    },
    {
      "ingredient": "60f7b3b3b3b3b3b3b3b3b3b4",
      "quantity": 2
    }
  ]
}
```

**Response:**
```json
{
  "message": "Price calculated successfully",
  "data": {
    "totalPrice": 25.98,
    "ingredients": [
      {
        "ingredient": {
          "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
          "name": "Chicken Breast",
          "price": 15.99,
          "category": "protein"
        },
        "quantity": 1,
        "itemPrice": 15.99
      }
    ]
  }
}
```

## Updated Order API

### Create Order with Custom Products

**POST** `/api/v1/order`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "items": [
    {
      "productType": "regular",
      "product": "60f7b3b3b3b3b3b3b3b3b3b3",
      "quantity": 1,
      "notes": "Extra spicy",
      "customizations": {
        "extras": ["Extra cheese"],
        "extrasWithPrices": [
          {
            "id": "extra1",
            "name": "Extra cheese",
            "price": "2.50"
          }
        ]
      }
    },
    {
      "productType": "custom",
      "customProduct": "60f7b3b3b3b3b3b3b3b3b3b5",
      "quantity": 1,
      "notes": "Well done",
      "specialInstructions": "No onions please"
    }
  ],
  "orderType": "dine-in",
  "table": "60f7b3b3b3b3b3b3b3b3b3b6",
  "location": "Table 5"
}
```

**Product Types:**
- `regular`: Standard menu items
- `custom`: User-created custom products

## Database Schema

### Ingredient Model
```javascript
{
  name: String (required, unique),
  price: Number (required, min: 0),
  description: String,
  category: String (enum: ["protein", "vegetable", "sauce", "cheese", "bread", "topping", "other"]),
  available: Boolean (default: true),
  image: String,
  createdBy: ObjectId (ref: "User"),
  timestamps: true
}
```

### Custom Product Model
```javascript
{
  name: String (required),
  ingredients: [{
    ingredient: ObjectId (ref: "Ingredient"),
    quantity: Number (default: 1, min: 1)
  }],
  totalPrice: Number (calculated automatically),
  description: String,
  createdBy: ObjectId (ref: "User"),
  isActive: Boolean (default: true),
  timestamps: true
}
```

### Updated Order Model
```javascript
{
  items: [{
    product: ObjectId (ref: "Product"), // for regular products
    customProduct: ObjectId (ref: "CustomProduct"), // for custom products
    productType: String (enum: ["regular", "custom"]),
    quantity: Number (required, min: 1),
    notes: String,
    customizations: {
      extras: [String],
      removals: [String],
      extrasWithPrices: [{
        id: String,
        name: String,
        price: String
      }]
    },
    specialInstructions: String,
    innerStatus: String (enum: ["pending", "preparing", "ready", "completed", "cancelled"])
  }],
  // ... other fields remain the same
}
```

## Usage Examples

### 1. Creating a Custom Burger
1. Get available ingredients: `GET /api/v1/ingredients?category=protein&available=true`
2. Calculate price: `POST /api/v1/custom-products/calculate-price`
3. Create custom product: `POST /api/v1/custom-products`
4. Add to order: `POST /api/v1/order`

### 2. Managing Ingredients (Admin)
1. Create ingredient: `POST /api/v1/ingredients`
2. Update prices: `PUT /api/v1/ingredients/:id`
3. Disable unavailable ingredients: `PUT /api/v1/ingredients/:id` (set available: false)

### 3. User Custom Products
1. View user's custom products: `GET /api/v1/custom-products/my-products`
2. Reorder favorite custom product: Include in order with `productType: "custom"`
3. Update custom product: `PUT /api/v1/custom-products/:id`

## Error Handling

Common error responses:

```json
{
  "message": "Ingredient not found",
  "stack": "Error stack trace"
}
```

```json
{
  "message": "Not authorized to order this custom product",
  "stack": "Error stack trace"
}
```

```json
{
  "message": "Invalid product type",
  "stack": "Error stack trace"
}
``` 